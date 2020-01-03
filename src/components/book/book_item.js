import React, {
  Component
} from 'react'
import './book.scss'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes} from '@fortawesome/free-solid-svg-icons'

export class BookItem extends Component {

  render() {
     var style = {
       backgroundImage: 'url(https://source.unsplash.com/user/erondu/600x400)'
     }
    return (<div> 
         < header className = "app-header" > 
           <div className = "app-card-list inline" id = "app-card-list" >
        < article className = "card" >
          < header style = {style} className = "card-header" >
            <h4 className = "card-header--title" > cat </h4> 
            </header>
             < div className = "card-body" >
               <p className = "date" > March 20 2015 </p>
               <h2 > title</h2>
               <p className = "body-content" > text </p>
               </div>
        </article>
        < FontAwesomeIcon icon = {faTimes}/>
        </div>
      </header>
      </div>
    )
  }
}
export default BookItem;