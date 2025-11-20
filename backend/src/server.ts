import app from "./app";

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log("GET    /polygons");
  console.log("POST   /polygons");
  console.log("DELETE /polygons/:id");
});
