import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
const models = [
  "MetaLlama-31-8B-Instruct",
  "MetaLlama-31-70B-Instruct",
  "MetaLlama-31-405B-Instruct",
  "MetaLlama-32-1B-Instruct",
  "MetaLlama-32-3B-Instruct",
  "Llama32-11B-Vision-Instruct",
  "Llama32-90B-Vision-Instruct",
]


export default function AiModelSelector({ aiModel, setAiModel }: { aiModel: string, setAiModel: (model: string) => void }) {


  const handleModelChange = (event: SelectChangeEvent) => {
    setAiModel(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, width:"100%", maxWidth:250 }} size="small">
      <InputLabel id="demo-select-small-label"> AI Model </InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={aiModel}
        label="AI model"
        onChange={handleModelChange}
      >
        {models.map((model, index) => <MenuItem key={index} value={model}>{model}</MenuItem>)}

      </Select>
    </FormControl>
  );
}
