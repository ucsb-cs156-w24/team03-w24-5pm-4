import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });


    test("on submit, makes request to backend, and redirects to /menuitemreview", async () => {

        const queryClient = new QueryClient();
        const menuitemreview = {
            id: 47,
            itemId: 7,
            reviewerEmail: "cgaucho@ucsb.edu",
            stars: "5",
            comments: "good",
            dateReviewed: "2022-02-02T00:00"
        };

        axiosMock.onPost("/api/menuitemreview/post").reply(202, menuitemreview);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId("MenuItemReviewForm-itemId")).toBeInTheDocument();
        });

        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        expect(itemIdField).toBeInTheDocument();

        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        expect(reviewerEmailField).toBeInTheDocument();

        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        expect(starsField).toBeInTheDocument();

        const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
        expect(commentsField).toBeInTheDocument();

        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed"); 
        expect(dateReviewedField).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(itemIdField, { target: { value: '47' } })
        fireEvent.change(reviewerEmailField, { target: { value: 'cgaucho@ucsb.edu' } })
        fireEvent.change(starsField, { target: { value: '5' } })
        fireEvent.change(commentsField, { target: { value: 'good' } })
        fireEvent.change(dateReviewedField, { target: { value: '2022-02-02T00:00' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            itemId: "47",
            reviewerEmail: "cgaucho@ucsb.edu",
            stars: "5",
            comments: "good",
            dateReviewed: "2022-02-02T00:00"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New menu item review Created - id: 47 itemId: 7");
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });
    });

});


