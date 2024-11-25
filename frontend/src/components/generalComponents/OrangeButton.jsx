import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

const OrangeButton = styled(Button)({
  backgroundColor: '#E46225', // custom background color
  color: '#FFFFFF', //custom text color
  '&:hover': {
    backgroundColor: '#913A12', // custom hover color
  },
})

export default OrangeButton