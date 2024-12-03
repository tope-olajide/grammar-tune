import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import Translate from "@mui/icons-material/Translate";
import ShortTextIcon from "@mui/icons-material/ShortText";
import { useEffect, useState } from "react";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
export default function MobileNav({ pageTitle }: { pageTitle:string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    switch(pageTitle) {
      case "Grammar Checker":
        setValue(0);
        break;
      case "Paraphraser":
        setValue(1);
        break;
      case "Summarizer": 
        setValue(2);
        break;
      case "Translator":
        setValue(3);
        break;
      default:
        setValue(4);
    }
  }, [pageTitle]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card
      sx={{
        width: "100vw",
        display: {
          xs: "block",
          sm: "block",
          md: "none",
          lg: "none",
          xl: "none",
          xxl: "none",
        },
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label=""
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ width: "100%" }}
      >
        <Link underline="none" href="/">
          <Tab icon={<SpellcheckIcon />} label="Grammar Checker" />
        </Link>
        <Link underline="none" href="/summarize">
          <Tab icon={<ShortTextIcon />} label="Summarizer" />
        </Link>
        <Link underline="none" href="#">
          <Tab icon={<HistoryEduIcon />} label="Paraphraser" />
        </Link>
        <Link underline="none" href="#">
          <Tab icon={<Translate />} label="Translator" />
        </Link>
        <Link underline="none" href="#">
          <Tab icon={<EditNoteIcon />} label="Content Generator" />
        </Link>
      </Tabs>
    </Card>
  );
}
