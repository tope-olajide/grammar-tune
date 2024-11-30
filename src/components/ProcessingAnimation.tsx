
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';

import AutoModeOutlinedIcon from '@mui/icons-material/AutoModeOutlined';
export default function ProcessingAnimation() {

    return (
        <>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={true}
            >
                <AutoModeOutlinedIcon className='spin' sx={{ fontSize: 40 }} />
                <Typography className="fade-in-out" variant="h5" component="h5" sx={{ marginLeft: 2 }}>
                    Processing...
                </Typography>
            </Backdrop>
        </>
    );
}
