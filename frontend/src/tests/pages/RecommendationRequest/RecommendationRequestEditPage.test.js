import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RecommendationRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/recommendationrequests", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Recommendation Request");
            expect(screen.queryByTestId("RecommendationRequestForm-requesterEmail")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/recommendationrequests", { params: { id: 17 } }).reply(200, {
                id: 17,
                requesterEmail: "coryzhao@ucsb.edu",
                professorEmail: "phtcon@ucsb.edu",
                explanation: "BS/MS Program",
                dateRequested: "2024-02-14T00:00",
                dateNeeded: "2024-08-12T00:00",
                done: false
            });
            axiosMock.onPut('/api/recommendationrequests').reply(200, {
                id: "17",
                requesterEmail: "coryzhao80796@gmail.com",
                professorEmail: "suri@ucsb.edu",
                explanation: "Stanford MS Program",
                dateRequested: "2024-02-15T00:00",
                dateNeeded: "2024-08-13T00:00",
                done: true
            });
        });

        const queryClient = new QueryClient();

        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-id");

            const idField = screen.getByTestId("RecommendationRequestForm-id");
            const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
            const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
            const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
            const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            const doneField = screen.getByTestId("RecommendationRequestForm-done");
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(requesterEmailField).toBeInTheDocument();
            expect(requesterEmailField).toHaveValue("coryzhao@ucsb.edu");
            expect(professorEmailField).toBeInTheDocument();
            expect(professorEmailField).toHaveValue("phtcon@ucsb.edu");
            expect(explanationField).toBeInTheDocument();
            expect(explanationField).toHaveValue("BS/MS Program");
            expect(dateRequestedField).toBeInTheDocument();
            expect(dateRequestedField).toHaveValue("2024-02-14T00:00");
            expect(dateNeededField).toBeInTheDocument();
            expect(dateNeededField).toHaveValue("2024-08-12T00:00");
            expect(doneField).toBeInTheDocument();
            expect(doneField).not.toBeChecked();

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(requesterEmailField, { target: { value: 'coryzhao80796@gmail.com' } });
            fireEvent.change(professorEmailField, { target: { value: 'suri@ucsb.edu' } });
            fireEvent.change(explanationField, { target: { value: 'Stanford MS Program' } });
            fireEvent.change(dateRequestedField, { target: { value: '2024-02-15T00:00' } });
            fireEvent.change(dateNeededField, { target: { value: '2024-08-13T00:00' } });
            fireEvent.click(doneField)

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("RecommendationRequest Updated - id: 17 explanation: Stanford MS Program");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequests" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "coryzhao80796@gmail.com",
                professorEmail: "suri@ucsb.edu",
                explanation: "Stanford MS Program",
                dateRequested: "2024-02-15T00:00",
                dateNeeded: "2024-08-13T00:00",
                done: true
            })); // posted object
        });
       
    });
});