import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

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

describe("HelpRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit HelpRequest");
            expect(screen.queryByTestId("HelpRequestForm-requesterEmail")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).reply(200, {
                id: 17,
                requesterEmail: "test01@gmail.com",
                teamId: "w24-5pm-4",
                tableOrBreakoutRoom: "Table 1",
                requestTime: "2024-02-10T12:00",
                explanation: "Test Help Request 01",
                solved: false
            });
            axiosMock.onPut('/api/helprequest').reply(200, {
                id: "17",
                requesterEmail: "test02@gmail.com",
                teamId: "w24-5pm-4",
                tableOrBreakoutRoom: "Table 2",
                requestTime: "2024-02-15T12:00",
                explanation: "Test Help Request 02",
                solved: true
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-requesterEmail");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(requesterEmailField).toHaveValue("test01@gmail.com");
            expect(teamIdField).toHaveValue("w24-5pm-4");
            expect(tableOrBreakoutRoomField).toHaveValue("Table 1");
            expect(requestTimeField).toHaveValue("2024-02-10T12:00");
            expect(explanationField).toHaveValue("Test Help Request 01");
            expect(solvedField).toBeChecked("false");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-requesterEmail");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(requesterEmailField).toHaveValue("test01@gmail.com");
            expect(teamIdField).toHaveValue("w24-5pm-4");
            expect(tableOrBreakoutRoomField).toHaveValue("Table 1");
            expect(requestTimeField).toHaveValue("2024-02-10T12:00");
            expect(explanationField).toHaveValue("Test Help Request 01");
            expect(solvedField).toBeChecked();
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(requesterEmailField, { target: { value: 'test02@gmail.com' } })
            fireEvent.change(teamIdField, { target: { value: 'w24-5pm-4' } })
            fireEvent.change(tableOrBreakoutRoomField, { target: { value: "Table 2" } })
            fireEvent.change(requestTimeField, { target: { value: '2024-02-15T12:00' } })
            fireEvent.change(explanationField, { target: { value: 'Test Help Request 02' } })
            fireEvent.click(solvedField)

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("HelpRequest Updated - id: 17 requesterEmail: test02@gmail.com");
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "test02@gmail.com",
                teamId: "w24-5pm-4",
                tableOrBreakoutRoom: "Table 2",
                requestTime: "2024-02-15T12:00",
                explanation: "Test Help Request 02",
                solved: true
            })); // posted object

        });

       
    });
});


