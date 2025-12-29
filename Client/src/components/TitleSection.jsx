import React from "react";

function TitleSection({ title }) {
  return (
    <h1 className="text-3xl font-bold dark:text-white   text-center mb-8">
      {title}
    </h1>
  );
}

export default TitleSection;
