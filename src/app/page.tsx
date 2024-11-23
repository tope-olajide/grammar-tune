"use client"

import Editor from "@/components/editor/Editor";

export default function Home() {
  return (
    <div>

   <Editor readOnly={false} defaultValue={undefined} onTextChange={function (delta: any): void {
        throw new Error("Function not implemented.");
      } } onSelectionChange={function (range: any): void {
        throw new Error("Function not implemented.");
      } } />
    </div>
  );
}
