import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Beyond Chat: Generative Interfaces for Language Models" },
    { name: "description", content: "Generative User Interfaces (GUIs) for language models that transform responses from traditional chat interfaces to dynamic, interactive interfaces" },
  ];
}

export default function Home() {
  return <Welcome />;
}
