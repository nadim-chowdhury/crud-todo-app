import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const navigate = useNavigate("/");

  const handleSubmit = () => {
    console.log({ name, number });
    const info =
      localStorage.getItem("info").length > 0
        ? JSON.parse(localStorage.getItem("info"))
        : [];

    localStorage.setItem("info", JSON.stringify([...info, { name, number }]));

    navigate("/");
  };

  return (
    <Box mt={4}>
      <TextField
        label="Full Name"
        variant="outlined"
        sx={{ marginRight: "16px" }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Phone Number"
        variant="outlined"
        sx={{ marginRight: "16px" }}
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Add
      </Button>
    </Box>
  );
}
