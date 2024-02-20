import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 12
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ArticlesEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/articles", { params: { id: 12 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Article");
            expect(screen.queryByTestId("ArticlesForm-title")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/articles", { params: { id: 12 } }).reply(200, {
                id: 12,
                title: "Places to eat",
                url: "https://fakeurl.com",
                explanation: "Article about places to eat",
                email: "fakeemail@gmail.com",
                dateAdded: "2024-02-10T12:00:00"
            });
            axiosMock.onPut('/api/articles').reply(200, {
                id: "12",
                title: "Places to eat",
                url: "https://fakeurl2.com",
                explanation: "Article about places to eat",
                email: "fakeemail2@gmail.com",
                dateAdded: "2024-02-10T12:00:00"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            //await screen.findByTestId("ArticlesForm-email");
            await screen.findByTestId("ArticlesForm-id");
            const idField = screen.getByTestId("ArticlesForm-id");  
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const emailField = screen.getByTestId("ArticlesForm-email");
        
            
            
            const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
            const submitButton = screen.getByTestId("ArticlesForm-submit");
            expect(idField).toHaveValue("12");
            expect (titleField).toHaveValue("Places to eat");
            expect (urlField).toHaveValue("https://fakeurl.com"); 
            expect (explanationField).toHaveValue( "Article about places to eat");
            expect (emailField).toHaveValue("fakeemail@gmail.com");
        
            
            
            expect (dateAddedField).toHaveValue("2024-02-10T12:00");
            expect (submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            //await screen.findByTestId("ArticlesForm-email");
            await screen.findByTestId("ArticlesForm-id");
            //const idField = screen.getByTestId("ArticlesForm-id");
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const emailField = screen.getByTestId("ArticlesForm-email");
        
            
            
            const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
            const submitButton = screen.getByTestId("ArticlesForm-submit");

            //expect(idField).toHaveValue("12");
            expect (titleField).toHaveValue("Places to eat");
            expect (urlField).toHaveValue("https://fakeurl.com"); 
            expect (explanationField).toHaveValue( "Article about places to eat");
            expect (emailField).toHaveValue("fakeemail@gmail.com");
        
            
            
            expect (dateAddedField).toHaveValue("2024-02-10T12:00");
            expect (submitButton).toBeInTheDocument();
            

            fireEvent.change(titleField, { target: { value: 'Places to eat' } });
            fireEvent.change(urlField, { target: { value: 'https://fakeurl2.com' } });
            fireEvent.change(explanationField, { target: { value: 'Article about places to eat' } });
            fireEvent.change(emailField, { target: { value: 'fakeemail2@gmail.com' } });
            fireEvent.change(dateAddedField, { target: { value: '2024-02-10T12:00:00' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Article Updated - id: 12 title: Places to eat");
            expect(mockNavigate).toBeCalledWith({ "to": "/articles" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 12 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: "Places to eat",
                url: "https://fakeurl2.com",
                explanation: "Article about places to eat",
                email: "fakeemail2@gmail.com",
                dateAdded: "2024-02-10T12:00"
            })); // posted object

        });

       
    });
});
