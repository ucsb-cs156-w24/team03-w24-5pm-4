import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { articlesFixtures} from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { QueryClient, QueryClientProvider } from "react-query";
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("ArticlesForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Title", "URL", "Explanation", "Email"];
    const testId = "ArticlesForm";
    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm initialContents={articlesFixtures.oneArticle} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    // test("Correct Error messsages on bad input", async () => {

    //     render(
    //         <Router  >
    //             <ArticlesForm />
    //         </Router>
    //     );
    //     // await screen.findByTestId("ArticlesForm-teamId");
    //     const emailField = screen.getByTestId("ArticlesForm-email");
    //     // const teamIdField = screen.getByTestId("ArticlesForm-teamId");
    //     const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    //     const submitButton = screen.getByTestId("ArticlesForm-submit");

    //     fireEvent.change(emailField, { target: { value: 'bad-input' } });
    //     fireEvent.change(dateAddedField, { target: { value: 'bad-input' } });
    //     fireEvent.click(submitButton);

    //     await screen.findByText(/Email must be a valid email./);
    //     //expect(screen.getByText(/Team ID must be a valid team id./)).toBeInTheDocument();
    //     expect(screen.getByText(/Date Added is required./)).toBeInTheDocument();
    // });


    // test("Correct Error messsages on missing input", async () => {

    //     render(
    //         <Router  >
    //             <ArticlesForm />
    //         </Router>
    //     );
    //     await screen.findByTestId("ArticlesForm-submit");
    //     const submitButton = screen.getByTestId("ArticlesForm-submit");

    //     fireEvent.click(submitButton);

       
    //     expect(screen.getByText(/Title is required./)).toBeInTheDocument();
    //     expect(screen.getByText(/URL is required./)).toBeInTheDocument();
        
    //     expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    //     await screen.findByText(/Email is required./);
    //     expect(screen.getByText(/Added Date Time is required./)).toBeInTheDocument();

    // });

    // test("No Error messsages on good input", async () => {

    //     const mockSubmitAction = jest.fn();


    //     render(
    //         <Router  >
    //             <ArticlesForm submitAction={mockSubmitAction} />
    //         </Router>
    //     );
    //     await screen.findByTestId("ArticlesForm-email");

    //     const titleField = screen.getByTestId("ArticlesForm-title");
    //     const urlField = screen.getByTestId("ArticlesForm-url");
    //     const explanationField = screen.getByTestId("ArticlesForm-explanation");
        
    //     const emailField = screen.getByTestId("ArticlesForm-email");
        
    //     const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    //     const submitButton = screen.getByTestId("ArticlesForm-submit");
    //     fireEvent.change(titleField, { target: { value: 'Example Title' } });
    //     fireEvent.change(urlField, { target: { value: 'https://test.com' } });
    //     fireEvent.change(explanationField, { target: { value: 'Explanation test' } });
    //     fireEvent.change(emailField, {target: {value: 'test@gmail.com'}});
    //     fireEvent.change(dateAddedField, { target: { value: '2024-02-10T12:00:00' } });
        
        
    //     //fireEvent.click(solvedField);
    //     fireEvent.click(submitButton);

    //     await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    //     expect(screen.queryByText(/Email must be a valid email./)).not.toBeInTheDocument();
    //     expect(screen.queryByText(/dateAdded must be in ISO format/)).not.toBeInTheDocument();
    //     //expect(screen.queryByText(/Team ID must be a valid team id./)).not.toBeInTheDocument();

    // });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Title is required/);
        expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
        expect(screen.getByText(/URL is required/)).toBeInTheDocument();
        expect(screen.getByText(/Email is required/)).toBeInTheDocument();
        expect(screen.getByText(/LocalDateTime is required/)).toBeInTheDocument();

        // const nameInput = screen.getByTestId(`${testId}-name`);
        //fireEvent.change(nameInput, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);

        // await waitFor(() => {
        //     expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
        // });
    });
    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-cancel");
        const cancelButton = screen.getByTestId("ArticlesForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});
