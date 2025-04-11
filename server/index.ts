import { storage } from "./storage";

async function runTest() {
  console.log("📂 All documents in memory:");
  const docs = await storage.getDocuments();
  docs.forEach((doc) => console.log(" -", doc.name));

  const summary1 = await storage.summarizeDocument(1);
  console.log("\n📝 Summary for default document:");
  console.log(summary1);

  const newDoc = await storage.createDocument({
    name: "CO full notes.pdf",
    type: "pdf",
    size: 250000,
    content: `This chapter introduces register transfer language concepts like register operations, control functions, common bus structure, and microoperations.`
  });

  const summary2 = await storage.summarizeDocument(newDoc.id);
  console.log("\n📝 Summary for uploaded document:");
  console.log(summary2);
}

runTest();
