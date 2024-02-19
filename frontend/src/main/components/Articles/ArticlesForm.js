import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function ArticlesForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all
   
    const navigate = useNavigate();
    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    // Stryker disable next-line all
    const email_regex = /[A-Za-z0-9]+@[A-Za-z]{4,}/i; // Accepts at least 1 letter or number, followed by one '@', followed by at least 4 letters. TAKEN FROM COLE FOSTER

    // const testIdPrefix = "ArticlesForm";
    //const url_regex = /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
    return (

        <Form onSubmit={handleSubmit(submitAction)}>


            <Row>

                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="ArticlesForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="title">Title</Form.Label>
                        <Form.Control
                            data-testid="ArticlesForm-title"
                            id="title"
                            type="text"
                            isInvalid={Boolean(errors.title)}
                            {...register("title", {
                                required: "Title is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="url">URL</Form.Label>
                        <Form.Control
                            data-testid="ArticlesForm-url"
                            id="url"
                            type="text"
                            isInvalid={Boolean(errors.url)}
                            {...register("url", {
                                required: "URL is required."
                            })}
                            
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.url?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>

                <Col>



                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="explanation">Explanation</Form.Label>
                        <Form.Control
                            data-testid="ArticlesForm-explanation"
                            id="explanation"
                            type="text"
                            isInvalid={Boolean(errors.explanation)}
                            {...register("explanation", {
                                required: "Explanation is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.explanation?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>


            <Row>

                <Col>



                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="email">Email</Form.Label>
                        <Form.Control
                            data-testid="ArticlesForm-email"
                            id="email"
                            type="text"
                            isInvalid={Boolean(errors.email)}
                            {...register("email", { required: true, pattern: email_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email&& 'Email is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="dateAdded">Date (iso format)</Form.Label>
                        <Form.Control
                            data-testid="ArticlesForm-dateAdded"
                            id="dateAdded"
                            type="datetime-local"
                            isInvalid={Boolean(errors.dateAdded)}
                            {...register("dateAdded", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.dateAdded && 'LocalDateTime is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>


            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="ArticlesForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="ArticlesForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default ArticlesForm;