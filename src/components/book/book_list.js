import React, {
  Component
} from 'react'
import './book.scss'
import {
  Button,
  Modal
} from 'antd';
import axios from 'axios'
import {
  FontAwesomeIcon
} from '@fortawesome/react-fontawesome'
import {
  faTimes, faArrowUp, faArrowDown
} from '@fortawesome/free-solid-svg-icons'

export class BookList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      book: [],
      query: "",
      filteredData: [],
      visible: false,
      fields: {},
      errors: {},
      nameup: true,
      dateup: true,
      authorup : true,
      items: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitnewBook = this.submitnewBook.bind(this);
    this.renderdataItem = this.renderdataItem.bind(this)
    this.sortByName = this.sortByName.bind(this);
    this.sortByDate = this.sortByDate.bind(this);
    this.sortByAuthor = this.sortByAuthor.bind(this);
    this.search = this.search.bind(this)
  }

  componentDidMount() {
    this.getBooks()
  }

  getBooks() {
    return axios.get("https://api.myjson.com/bins/dzc90")
      .then(response => {
        this.setState({
          book: response.data,
          items: response.data
        });
        return response.data
      });
  }

    compareBy(key) {
      return function (a, b) {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
      };
    }

      sortByName(key) {
        let arrayCopy = [...this.state.items];
        arrayCopy.sort(this.compareBy(key));
        this.setState({
          items: arrayCopy
        });
        this.state.nameup = !this.state.nameup
      }

      sortByDate(key) {
        let arrayCopy = [...this.state.items];
        arrayCopy.sort(this.compareBy(key));
        this.setState({
          items: arrayCopy
        });
        this.state.dateup = !this.state.dateup
      }

      sortByAuthor(key) {
        let arrayCopy = [...this.state.items];
        arrayCopy.sort(this.compareBy(key));
        this.setState({
          items: arrayCopy
        });
        this.state.authorup = !this.state.authorup
      }

  search (event) {
        var updatedList = this.state.book;
        updatedList = updatedList.filter( (item) => {
          return item.name.toLowerCase().search(
            event.target.value.toLowerCase()) !== -1;
        });
        this.setState({
          items: updatedList
        });
  };

  componentWillMount(){
    this.setState({
      items: this.state.book
    })
  }

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });

  }

  putBook(updatedData) {
    axios.put('https://api.myjson.com/bins/dzc90',
        updatedData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      .then(response => {
        this.setState({
          book: response.data,
          items: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  renderdataItem() {
    let {
      book,
      items
    } = this.state
    return (items).map((item, index) => {
      return <tbody style={{color:'grey'}}>
        <tr>
          <td style={{width:'20%'}}>{item.name}</td>
          < td style = {
              {
                width: '20%'
              }
            } > {
            item.author
          } < /td>
          < td style = {
            {
              width: '20%'
            }
          } > {
            item.date
          } < /td>
          < td style = {
            {
              backgroundImage: `url(${item.url})`,
              width: 'auto',
              height: '25vh',
              paddingBottom:'2%'
            }
          } > < /td>
          < td style={{textAlign:'center', marginLeft:'5%'}}> 
          <FontAwesomeIcon icon = {faTimes}
          style = {
            {
              cursor: 'pointer'
            }
          }
           onClick = {() => {this.renderDeleteItem(item)}}
           /> </td>
        </tr>
      </tbody>
    })
  }

  renderDeleteItem = (i) => {
    let newData = this.state.book.filter(b => {
      return b.name !== i.name
    })
    this.putBook(newData)

    let newDataitem = this.state.items.filter(b => {
      return b.name !== i.name
    })
    this.putBook(newDataitem)
  }

  submitnewBook(e) {
    e.preventDefault();
    if (this.validateForm()) {
      const $ = window.$;
      let fields = {};
      fields["bookName"] = "";
      fields["url"] = "";
      fields["author"] = "";
      fields["date"] = "";
      this.setState({
        fields: fields
      });
      let hh = {
        name: this.state.fields.bookName,
        url: this.state.fields.url,
        author: this.state.fields.author,
        date: this.state.fields.date
      }

      this.getBooks().then(data => {
        let push = data
        push.push(hh)
        this.state.book = push;
        this.putBook(this.state.book)
      });
      this.setState({
        visible: false,
      });
    }
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["bookName"]) {
      formIsValid = false;
      errors["bookName"] = "*Please enter Book name.";
    }

    if (typeof fields["bookName"] !== "undefined") {
      if (!fields["bookName"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["bookName"] = "*Please enter alphabet characters only.";
      }
    }

    if (!fields["date"]) {
      formIsValid = false;
      errors["date"] = "*Please enter Relese Date.";
    }

    if (typeof fields["date"] !== "undefined") {
      //regular expression for date validation
      var pattern = new RegExp(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/);
      if (!pattern.test(fields["date"])) {
        formIsValid = false;
        errors["date"] = "*Please enter valid date.";
      }
    }

    if (!fields["author"]) {
      formIsValid = false;
      errors["author"] = "*Please enter author name.";
    }

    if (typeof fields["author"] !== "undefined") {
      if (!fields["author"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["author"] = "*Please enter alphabet characters only.";
      }
    }

    if (!fields["url"]) {
      formIsValid = false;
      errors["url"] = "*Please upload your image.";
    }

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.submitnewBook(e);
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return ( <div className = "container" >
      <form >
      <input placeholder = "Search for..."
     
      onChange = {
        this.search
      }
      style = {
        {
          color: 'black'
        }
      }
      />   
      </form > 
      <div >
      <Button type = "primary"
      style = {
        {
          fontSize: "1rem",
          textAlign: 'center',
          margin:'3%'
        }
      }
      onClick = {
        this.showModal
      } > ADD NEW Book 
      </Button>     
      <Modal title = "ADD Book"
      visible = {
        this.state.visible
      }
      onOk = {
        this.handleOk
      }
      onCancel = {
        this.handleCancel
      } >
      <form method = "post"
      name = "newBook"
      onSubmit = {
        this.submitnewBook
      } >
      <label > Book Name </label>    
      <input type = "text"
      name = "bookName"
      value = {
        this.state.fields.bookName
      }
      onChange = {
        this.handleChange
      }
      />      
      <div className = "errorMsg" > {
        this.state.errors.bookName
      } </div>     
      <label > Release Date </label>    
      <input type = "text"
      name = "date"
      value = {
        this.state.fields.date
      }
      onChange = {
        this.handleChange
      }
      />     
      <div className = "errorMsg" > {this.state.errors.date} </div>     
      <label > author Name </label>    
      <input type = "text"
      name = "author"
      value = {
        this.state.fields.author
      }
      onChange = {
        this.handleChange
      }
      />     
      <div className = "errorMsg" > {
        this.state.errors.author
      } </div>     
      <label > Upload Cover Book </label>    
      <input type = "file"
      name = "url"
      value = {
        this.state.fields.url
      }
      onChange = {
        this.handleChange
      }
      accept = "image/*" / >
      <div className = "errorMsg" > {this.state.errors.url} </div>  
      </form >   
      </Modal>   
      </div > 
     
  < table style = {{width:"100%"}} >
    <thead >
    < tr style={{color:'black'}} > 
    {
      this.state.nameup == true ? < th onClick = {
          () => this.sortByName('name')
       } >
        Name <FontAwesomeIcon icon = {
          faArrowUp
        }
      style = {
        {
          color: 'grey',
          cursor: 'pointer'
        }
      }
      /> 
      </th> : <th onClick = {
      () => this.sortByName('name')
      } >
      Name
        <FontAwesomeIcon icon = {faArrowDown}
        style = {
          {
            color: 'grey',
            cursor: 'pointer'
          }
        }
        /> 
      </th> 
    }
        {
          this.state.authorup == true ? < th onClick = {
              () => this.sortByAuthor('author')
            } >
            Author 
            <FontAwesomeIcon icon = {faArrowUp}
          style = {
            {
              color: 'grey',
              cursor: 'pointer'
            }
          }
          /> 
          </th >: < th onClick = {
              () => this.sortByAuthor('author')
            } >
            Author 
            <FontAwesomeIcon icon = {faArrowDown}
            style = {
              {
                color: 'grey',
                cursor: 'pointer'
              }
            }
            /> 
          </th >
        }
    {
      this.state.dateup == true ? < th onClick = {() => this.sortByDate('date')} >
        Date 
        < FontAwesomeIcon icon = {
          faArrowUp
        }
        style = {
          {
            color: 'grey',
            cursor: 'pointer'
          }
        }
        /> 
      </th >: < th onClick = {() => this.sortByDate('date')} >
        Date
        < FontAwesomeIcon icon = {faArrowDown}
        style = {
          {
            color: 'grey',
            cursor: 'pointer'
          }
        }
        /> 
        </th >
    }
      < th > Image </th> 
      < th ></th>  
      </tr> 
      </thead>
      {this.renderdataItem()}
      </table>
      </div>
    )
  }
}
export default BookList;