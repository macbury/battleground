import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlay, 
  faPause, 
  faStop, 
  faTerminal, 
  faTrophy, 
  faBook,
  faCode,
  faRobot,
  faHeadphones,
  faCarBattery
} from '@fortawesome/free-solid-svg-icons'

library.add(faPlay)
library.add(faPause)
library.add(faStop)
library.add(faTerminal)
library.add(faTrophy)
library.add(faBook)
library.add(faCode)
library.add(faRobot)
library.add(faHeadphones)
library.add(faCarBattery)

require('../monaco/tank_syntax')
require('./index.scss')
