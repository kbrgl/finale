import styled from 'styled-components'

const Button = styled.button`
  height: 45px;
  padding: 0 22px;
  text-align: center;
  font-weight: 600;
  line-height: 45px;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  border: 0;
  outline: 0;
  border-radius: 4px;
  cursor: pointer;
  box-sizing: border-box;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
  background-color: #2977f5;
  box-shadow: 0 2px 10px -2px rgba(0, 0, 0, 0.1);
  color: rgba(255, 255, 255, 0.9);
  display: block;
  transition-property: background-color, transform, box-shadow;

  &:hover {
    background-color: #2365cf;
  }
`

export default Button
