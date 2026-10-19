import React from "react";
import { FlaskConical, Zap, Dna, BookOpen, Globe, Mountain } from "lucide-react";

export default function SubjectIcon({ name, size = 26, color = "currentColor" }) {
  switch (name) {
    case "FlaskConical":
      return <FlaskConical size={size} color={color} strokeWidth={2.2} />;
    case "Zap":
      return <Zap size={size} color={color} strokeWidth={2.2} />;
    case "Dna":
      return <Dna size={size} color={color} strokeWidth={2.2} />;
    case "BookOpen":
      return <BookOpen size={size} color={color} strokeWidth={2.2} />;
    case "Globe":
      return <Globe size={size} color={color} strokeWidth={2.2} />;
    case "Mountain":
      return <Mountain size={size} color={color} strokeWidth={2.2} />;
    default:
      return <BookOpen size={size} color={color} strokeWidth={2.2} />;
  }
}
