import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../services/helper";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import { MdDelete } from "react-icons/md";

const ManageQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [heading, setHeading] = useState("");
    const [link, setLink] = useState("");
    const [image, setImage] = useState(null);
    const [questions, setQuestions] = useState([{ question: "", suggestion: "", options: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] }]);
    const [suggestions, setSuggestions] = useState(["", "", "", ""]);
    const [traitTitle, setTraitTitle] = useState("");

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/manage-quizzes`, { withCredentials: true });
            setQuizzes(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch quizzes");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
            const { width, height } = img;
            URL.revokeObjectURL(objectUrl);

            if (width < 200 || height < 200) {
                toast.error(`Image too small (${width}x${height}px). Minimum 200x200px required.`);
                e.target.value = "";
                setImage(null);
                return;
            }

            const aspectRatio = width / height;
            if (aspectRatio < 0.5 || aspectRatio > 2.0) {
                toast.warn(`Unusual aspect ratio (${width}x${height}px). Recommended: roughly square or portrait/landscape up to 2:1.`);
            }
            setImage(file);
        };
        img.src = objectUrl;
    };

    const handleQuestionChange = (qIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex][field] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: "", suggestion: "", options: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] }]);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].options.length >= 4) return toast.warn("Maximum 4 options allowed");
        newQuestions[qIndex].options.push({ text: "", isCorrect: false });
        setQuestions(newQuestions);
    };

    const removeQuestion = (qIndex) => {
        if (questions.length <= 1) return;
        const newQuestions = [...questions];
        newQuestions.splice(qIndex, 1);
        setQuestions(newQuestions);
    };

    const updateSuggestion = (index, value) => {
        const newSugg = [...suggestions];
        newSugg[index] = value;
        setSuggestions(newSugg);
    };

    const resetForm = () => {
        setHeading("");
        setLink("");
        setImage(null);
        setTraitTitle("");
        setQuestions([{ question: "", suggestion: "", options: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] }]);
        setSuggestions(["", "", "", ""]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return toast.error("Please select an image file before saving.");
        if (!heading.trim() || !link.trim()) return toast.error("Heading and Link are required");

        let routeLink = link.replace(/[^a-zA-Z0-9]/g, '');

        const formData = new FormData();
        formData.append("heading", heading);
        formData.append("link", routeLink);
        formData.append("image", image);
        formData.append("questions", JSON.stringify(questions));
        formData.append("suggestions", JSON.stringify(suggestions));
        formData.append("traitTitle", traitTitle);

        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/api/manage-quizzes/generate`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            toast.success("Quiz created successfully!");
            resetForm();
            setShowModal(false);
            fetchQuizzes();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to create quiz");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (quizId) => {
        if (!window.confirm("Are you sure you want to delete this quiz completely? This will wipe the DB and file system!")) return;
        
        try {
            await axios.delete(`${BASE_URL}/api/manage-quizzes/delete/${quizId}`, { withCredentials: true });
            toast.success("Quiz deleted successfully");
            fetchQuizzes();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete quiz");
        }
    };

    return (
        <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-primary mb-0">Manage Quizzes</h4>
                <Button variant="primary" onClick={() => setShowModal(true)}>Add New Quiz</Button>
            </div>

            <Row className="g-4">
                {quizzes.map((quiz) => (
                    <Col md={4} key={quiz.id}>
                        <Card className="shadow-sm">
                            <Card.Body className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-1">{quiz.heading}</h6>
                                    <small className="text-muted">{quiz.link}</small>
                                </div>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(quiz.id)}>
                                    <MdDelete size={16} />
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={showModal} onHide={() => { resetForm(); setShowModal(false); }} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Quiz Heading</Form.Label>
                                    <Form.Control required type="text" value={heading} onChange={e => setHeading(e.target.value)} placeholder="e.g. Anxiety Quiz" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Link / Route Name (No spaces or specials)</Form.Label>
                                    <Form.Control required type="text" value={link} onChange={e => setLink(e.target.value)} placeholder="e.g. MyAnxietyQuiz" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Quiz Image</Form.Label>
                                    <small className="text-muted d-block mb-1">
                                        Recommended: <strong>400×400px to 800×800px</strong>, square preferred. Formats: JPG, PNG, WEBP.
                                    </small>
                                    <Form.Control required type="file" onChange={handleImageChange} accept="image/*" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Trait Category Info</Form.Label>
                                    <Form.Control type="text" value={traitTitle} onChange={e => setTraitTitle(e.target.value)} placeholder="e.g. Anxiety levels" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h5 className="mt-4 border-bottom pb-2">Questions</h5>
                        {questions.map((q, qIndex) => (
                            <Card className="mb-3 p-3 bg-light" key={qIndex}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Question {qIndex + 1}</Form.Label>
                                    <Form.Control required type="text" value={q.question} onChange={e => handleQuestionChange(qIndex, 'question', e.target.value)} />
                                </Form.Group>
                                
                                <h6>Options:</h6>
                                {q.options.map((opt, oIndex) => (
                                    <Row key={oIndex} className="align-items-center mb-2">
                                        <Col>
                                            <Form.Control required type="text" placeholder="Option text" value={opt.text} onChange={e => handleOptionChange(qIndex, oIndex, 'text', e.target.value)} />
                                        </Col>
                                        <Col xs="auto">
                                            <Form.Check 
                                                type="radio" 
                                                name={`correct-${qIndex}`} 
                                                checked={opt.isCorrect} 
                                                onChange={() => {
                                                    const newQuestions = [...questions];
                                                    newQuestions[qIndex].options.forEach(o => o.isCorrect = false);
                                                    newQuestions[qIndex].options[oIndex].isCorrect = true;
                                                    setQuestions(newQuestions);
                                                }}
                                                label="Correct"
                                            />
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Group className="mt-3">
                                    <Form.Label className="fw-semibold text-info">💡 Per-Question Suggestion (shown after user answers)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="e.g. Passion is the best driver of success — keep nurturing it!"
                                        value={q.suggestion || ""}
                                        onChange={e => handleQuestionChange(qIndex, 'suggestion', e.target.value)}
                                    />
                                </Form.Group>
                                <div className="d-flex justify-content-between mt-2">
                                    <Button variant="outline-primary" size="sm" onClick={() => addOption(qIndex)}>Add Option</Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => removeQuestion(qIndex)}>Remove Question</Button>
                                </div>
                            </Card>
                        ))}
                        <Button variant="outline-success" onClick={addQuestion} className="mb-4">Add Another Question</Button>

                        <h5 className="border-bottom pb-2">Suggestions Based on Performance</h5>
                        <Form.Group className="mb-2">
                            <Form.Label>≥ 80% Performance Suggestion</Form.Label>
                            <Form.Control type="text" value={suggestions[0]} onChange={e => updateSuggestion(0, e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>≥ 60% Performance Suggestion</Form.Label>
                            <Form.Control type="text" value={suggestions[1]} onChange={e => updateSuggestion(1, e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>≥ 40% Performance Suggestion</Form.Label>
                            <Form.Control type="text" value={suggestions[2]} onChange={e => updateSuggestion(2, e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>&lt; 40% Performance Suggestion</Form.Label>
                            <Form.Control type="text" value={suggestions[3]} onChange={e => updateSuggestion(3, e.target.value)} />
                        </Form.Group>

                        <div className="text-end">
                            <Button variant="secondary" className="me-2" onClick={() => { resetForm(); setShowModal(false); }}>Cancel</Button>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? "Creating..." : "Save Quiz"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ManageQuizzes;
