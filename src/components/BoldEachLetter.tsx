import React from "react";
import { textVide } from "text-vide";

const BoldEachLetter: React.FC<{ text: string; bionic: boolean }> = ({
  text,
  bionic,
}) => {
  const highlightedText = textVide(text, {
    ignoreHtmlTag: false,
    ignoreHtmlEntity: false,
  });

  return (
    <p
      className="text-justify"
      dangerouslySetInnerHTML={{ __html: bionic ? highlightedText : text }}
    />
  );
};

export default BoldEachLetter;
