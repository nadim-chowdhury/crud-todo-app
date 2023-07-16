import { Box, Button, TextField } from "@mui/material";

export default function Update() {
  return (
    <Box mt={4}>
      <TextField
        label="Full Name"
        variant="outlined"
        sx={{ marginRight: "16px" }}
      />
      <TextField
        label="Phone Number"
        variant="outlined"
        sx={{ marginRight: "16px" }}
      />
      <Button variant="contained">Update</Button>
    </Box>
  );
}
