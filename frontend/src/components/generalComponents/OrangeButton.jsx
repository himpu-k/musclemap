import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

const OrangeButton = styled(Button)({
  backgroundColor: '#E46225', // Custom background color
  color: '#FFFFFF', //cutom text color
  '&:hover': {
    backgroundColor: '#913A12', // cutom hover color
  },
})

export default OrangeButton