import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, FormControlLabel, CircularProgress, Typography } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import {API_URL} from "../../config";

function SharePageButton({ token, pageId }) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [giveWrite, setGiveWrite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleOpen = () => {
        setOpen(true);
        setEmail("");
        setGiveWrite(false);
        setMessage("");
    };

    const handleClose = () => {
        setOpen(false);
        setMessage("");
    };

    const handleShare = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch(API_URL+"/api/pages/sharepage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    pageId,
                    userEmail: email,
                    giveWritePermission: giveWrite,
                }),
            });
            const data = await res.json();
            setMessage(data.message || "Shared!");
        } catch {
            setMessage("Error sharing page.");
        }
        setLoading(false);
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleOpen}
                sx={{ ml: 1 }}
            >
                Share
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Share Page</DialogTitle>
                <form onSubmit={handleShare}>
                    <DialogContent>
                        <TextField
                            label="User Email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={giveWrite}
                                    onChange={e => setGiveWrite(e.target.checked)}
                                />
                            }
                            label="Give edit permission"
                        />
                        {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
                        {message && (
                            <Typography color={message.includes("Error") ? "error" : "primary"} sx={{ mt: 1 }}>
                                {message}
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={loading}>Share</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}

export default SharePageButton;