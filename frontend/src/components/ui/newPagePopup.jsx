import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";

import {API_URL} from "../../config";

export default function NewPagePopup({ open, onClose }) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (!name.trim()) return;
        handleCreatePage(name);
        setName("");
        onClose();
    };

    const handleCreatePage = async (name) => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(API_URL + "/api/pages/createpage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        pageName: name,
                        token: token
                    }
                )
            });

            if (res.ok) {
                window.location.reload();
            } else {
                navigate("/");
            }
        } catch (error) {
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Page name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <LoadingButton
                    variant="contained"
                    onClick={handleSubmit}
                    loading={loading}
                >
                    Create
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
