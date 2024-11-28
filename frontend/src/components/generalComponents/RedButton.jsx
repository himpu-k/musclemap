import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

const RedButton = styled(Button)({
    backgroundColor: '#D32F2F', // Strong red for the delete action
    color: '#FFFFFF', // White text color for contrast
    '&:hover': {
      backgroundColor: '#9A0007', // Darker red on hover to indicate active state
  },
})

export default RedButton