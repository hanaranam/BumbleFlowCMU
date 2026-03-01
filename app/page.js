import fs from "node:fs";
import path from "node:path";
import BumbleFlowPrototype from "@/components/BumbleFlowPrototype";

export default function HomePage() {
  const templatePath = path.join(process.cwd(), "src/templates/bumbleflow-main.html");
  const html = fs.readFileSync(templatePath, "utf8");
  return <BumbleFlowPrototype html={html} />;
}
