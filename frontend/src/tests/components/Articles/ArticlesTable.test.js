import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { articlesFixtures} from "fixtures/articlesFixtures";
import ArticlesTable from "main/components/Articles/ArticlesTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("ArticlesTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["id", "Title", "URL", "Explanation", "Email", "Date"];
  const expectedFields = ["id", "title", "url", "explanation", "email", "dateAdded"];
  const testId = "ArticlesTable";

  test("renders empty table correctly", () => {
    
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable articles={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable articles={articlesFixtures.threeArticles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    
    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Best places to eat");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://fakeurl.com");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("Article about the best places to eat");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("fakeemailW@some.com");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2022-01-02T12:00:00");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("Worst places to eat");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-url`)).toHaveTextContent("https://fakeurlW.com");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-explanation`)).toHaveTextContent("Article about the worst places to eat");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-email`)).toHaveTextContent("fakeemail@some.com");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-dateAdded`)).toHaveTextContent("2022-01-02T12:01:00");
    
    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Has the expected column headers, content for ordinary user", () => {
    // arrange
    const currentUser = currentUserFixtures.userOnly;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable articles={articlesFixtures.threeArticles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Best places to eat");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://fakeurl.com");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("Article about the best places to eat");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("fakeemailW@some.com");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2022-01-02T12:00:00");


    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("Worst places to eat");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-url`)).toHaveTextContent("https://fakeurlW.com");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-explanation`)).toHaveTextContent("Article about the worst places to eat");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-email`)).toHaveTextContent("fakeemail@some.com");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-dateAdded`)).toHaveTextContent("2022-01-02T12:01:00");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });


  test("Edit button navigates to the edit page", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable articles={articlesFixtures.threeArticles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Best places to eat");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://fakeurl.com");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("Article about the best places to eat");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("fakeemailW@some.com");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2022-01-02T12:00:00");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/articles/edit/1'));

  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable articles={articlesFixtures.threeArticles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Best places to eat");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://fakeurl.com");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("Article about the best places to eat");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("fakeemailW@some.com");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2022-01-02T12:00:00");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);
  });
});
