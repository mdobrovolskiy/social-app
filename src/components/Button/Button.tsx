import styles from './Button.module.sass'
interface IButton {
  text: string
  color?: string
  bgc?: string
  onClick?: any
}
const Button = ({ text, bgc, onClick, color }: IButton) => {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: bgc, color: color }}
      className={styles.main}
    >
      {text}
    </button>
  )
}

export default Button
