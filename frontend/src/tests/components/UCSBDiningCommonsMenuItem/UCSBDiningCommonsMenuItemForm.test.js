import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("UCSBDiningCommonsMenuItemForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm />
            </Router>
        );
    });


    test("renders correctly when passing in a UCSBDiningCommonsMenuItem", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm initialContents={ucsbDiningCommonsMenuItemFixtures.oneDiningCommonsMenuItem} />
            </Router>
        );
        await screen.findByTestId(/UCSBDiningCommonsMenuItemForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/UCSBDiningCommonsMenuItemForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm />
            </Router>
        );
        const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

        fireEvent.click(submitButton);

    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm />
            </Router>
        );
        await screen.findByTestId("UCSBDiningCommonsMenuItemForm-submit");
        const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Station is required./);
        expect(screen.getByText(/Name is required./)).toBeInTheDocument();
        expect(screen.getByText(/Dining Commons Code is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm submitAction={mockSubmitAction} />
            </Router>
        );

        const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
        const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
        const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
        const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

        fireEvent.change(stationField, { target: { value: 'fruit' } });
        fireEvent.change(nameField, { target: { value: 'apple' } });
        fireEvent.change(diningCommonsCodeField, { target: { value: 'portola' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <UCSBDiningCommonsMenuItemForm />
            </Router>
        );
        await screen.findByTestId("UCSBDiningCommonsMenuItemForm-cancel");
        const cancelButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});

