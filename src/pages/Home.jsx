import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Home() {
  const [allInfo, setAllInfo] = useState([]);
  console.log("🚀 ~ file: Home.jsx:5 ~ Home ~ allInfo:", allInfo);

  useEffect(() => {
    const info = localStorage.getItem("info");
    setAllInfo(JSON.parse(info));
  }, []);

  const handleDelete = (i) => {
    const remainInfo = allInfo.map((info, index) => i !== index);
    setAllInfo(remainInfo);
    localStorage.setItem("info", JSON.stringify(remainInfo));
  };

  return (
    <Box mt={4}>
      {allInfo && allInfo.length > 0 ? (
        allInfo.map((info, i) => (
          <Box key={i} mt={2}>
            <Typography>Name: {info.name}</Typography>
            <Typography mb={1}>Number: {info.number}</Typography>
            <Button variant="outlined" onClick={() => handleDelete(i)}>
              Delete
            </Button>
          </Box>
        ))
      ) : (
        <Typography mt={4}>No data found. Create data first. </Typography>
      )}
    </Box>
  );
}
