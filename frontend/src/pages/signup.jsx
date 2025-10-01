import React, { useState } from "react";
import {
    Box,
    Container,
    TextField,
    Typography,
    Paper,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../config";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors("");
        let data;

        try {
            const res = await fetch(API_URL + "/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, confirmPassword }),
            });

            data = await res.json();
            if (!res.ok) {
                setErrors(data.message);
            }

            localStorage.setItem("token", data.token);
            navigate("/home");
        } catch (err) {
            setErrors(data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper
                elevation={4}
                sx={{ p: 4, mt: 10, borderRadius: 3 }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Sign Up
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    {errors && (
                        <Typography color="error" variant="body2" align="center">
                            {errors}
                        </Typography>
                    )}



                    <TextField
                        label="Name"
                        type="text"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Confirm password"
                        type="password"
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        fullWidth
                    />

                    <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        loading={loading}
                    >
                        Sign Up
                    </LoadingButton>

                </Box>
            </Paper>
        </Container>
    );
}