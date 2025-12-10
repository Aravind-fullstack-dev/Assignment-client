import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Link as MuiLink,
    Checkbox,
    FormControlLabel,
} from "@mui/material";

import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";

export default function LoginForm() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

   const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await response.json();
        console.log(data, "login response");

        // Check if response is OK
        if (!response.ok) {
            toast.error(data.message || "Login failed");
            setLoading(false);
            return;
        }

        // Validate token
        if (data.token) {
            localStorage.setItem("authToken", data.token);
            toast.success("Login successful!");
            navigate("/dashboard"); // Navigate only after token is valid
        } else {
            toast.error("Invalid token received");
        }
    } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
    }

    setLoading(false);
};


    return (
        <Box
            sx={{
                height: "97vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #F0F4FF 0%, #DDE8FF 50%, #F3F5FF 100%)",
                p: 0,
                // mt: 2,
            }}
        >
            <Paper
                elevation={10}
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    p: 5,
                    borderRadius: 4,
                    backdropFilter: "blur(10px)",
                    background: "rgba(255,255,255,0.8)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                    animation: "fadeIn 0.6s ease",
                }}
            >
                {/* PAGE TITLE */}
                <Typography
                    variant="h4"
                    align="center"
                    sx={{ fontWeight: 700, mb: 1, color: "#1E293B" }}
                >
                    Welcome
                </Typography>
                <Typography
                    variant="body2"
                    align="center"
                    sx={{ mb: 4, color: "#475569" }}
                >
                    Login to your employee account
                </Typography>

                {/* INPUT FIELDS */}
                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        sx={{ mb: 3 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email sx={{ color: "#3b82f6" }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        sx={{ mb: 3 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock sx={{ color: "#3b82f6" }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* REMEMBER ME & FORGOT */}
                    <Box
                        sx={{
                            // display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 3,
                        }}
                    >
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Remember me"
                            sx={{ color: "#475569" }}
                        />

                        <MuiLink
                            component={RouterLink}
                            to="/forgot-password"
                            sx={{
                                fontSize: "14px",
                                color: "#2563EB",
                                textDecoration: "none",
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            Forgot?
                        </MuiLink>
                    </Box>

                    {/* LOGIN BUTTON */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            py: 1.4,
                            fontWeight: 600,
                            fontSize: "1rem",
                            borderRadius: "10px",
                            background: "linear-gradient(90deg, #2563EB, #3B82F6)",
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={26} color="inherit" /> : "Sign In"}
                    </Button>

                    {/* SIGNUP LINK */}
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ mt: 3, color: "#475569" }}
                    >
                        Don't have an account?{" "}
                        <MuiLink
                            component={RouterLink}
                            to="/signup"
                            sx={{ color: "#2563EB", fontWeight: 600 }}
                        >
                            Create one
                        </MuiLink>
                    </Typography>
                </form>
            </Paper>
        </Box>
    );
}
