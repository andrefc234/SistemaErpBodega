import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'
import { NotificationProvider } from '../context/NotificationContext'

function MyApp({ Component, pageProps }) {
  return (
    <NotificationProvider>
      <Component {...pageProps} />
    </NotificationProvider>
  )
}

export default MyApp
