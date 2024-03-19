
class Login extends React.Component {

    sendLoginRequest() {
        let formData = new FormData( document.querySelector('#login-form') );
        fetch('/api/login/', {
            method: 'POST',
            body: formData
        })
        .then(result => result.text())
        .then(
            (result) => {
                if (result == 'ok') {
                    this.props.onLogin();
                }
                else {
                    alert('Bad username/password combo');
                }
            },
            (error) => {
                alert('General login error');
            }
        )
    }

    onRegister() {
	    this.props.registering();
    }

    render() {
        return (
            <form id="login-form">
             <input
                name="username"
                id="username"
                type="text"
                placeholder="username" />
             <input
                name="password"
                id="password"
                type="password"
                placeholder="password" />
             <button
                id="login-button"
                onClick={(evt) => {
                    evt.preventDefault();
                    this.sendLoginRequest();
                }}>
               Login
             </button>
	     <br />
	     
	     <button
                id="register"
                onClick={(evt) => {
                    evt.preventDefault();
                    this.onRegister();
                }}>
               Register new account
             </button>

            </form>
        );
    }
}

class Register extends React.Component {

    sendRegisterRequest() {
        let formData = new FormData( document.querySelector('#register-form') );
        fetch('/api/register/', {
            method: 'POST',
            body: formData
        })
        .then(result => result.text())
        .then(
            (result) => {
                if (result == 'ok') {
		    alert('New account created');
                    this.props.backToLogin();
                }
                else {
                    alert(result);
                }
            },
            (error) => {
                alert('General login error');
            }
        )
    }

    goBack() {
            this.props.backToLogin();
    }

    render() {
        return (
            <form id="register-form">
             <input
                name="username"
                id="username"
                type="text"
                placeholder="username" />
             <input
                name="password"
                id="password"
                type="password"
                placeholder="password" />
	     <br />
	     <input
		name="email"
		id="email"
		type="email"
		placeholder="email" />
             <button
                id="register-button"
                onClick={(evt) => {
                    evt.preventDefault();
                    this.sendRegisterRequest();
                }}>
               Register New Account
             </button>

	     <br />
             <button
                id="go-back"
                onClick={(evt) => {
                    evt.preventDefault();
                    this.goBack();
                }}>
               Go back
             </button>

            </form>
        );
    }
}

function release(compID) {
    fetch('/api/release/' + compID,{
        method: 'PUT'
    });
    console.log("release");
}

class Computers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            computers: [],
            isLoaded: false,
            error: null,
        };
    }

    componentDidMount() {
        fetch('/api/statuses/')
        .then(result => result.json())
        .then(
            (result) => {
                this.setState({
                    computers: result,
                    isLoaded: true
                });
            },
            (error) => {
                this.setState({
                    error: error,
                    isLoaded: true
                });
            }
        )
    }
    onReload() {
        fetch('/api/statuses/')
        .then(result => result.json())
        .then(
            (result) => {
                this.setState({
                    computers: result,
                    isLoaded: true
                });
            },
            (error) => {
                this.setState({
                    error: error,
                    isLoaded: true
                });
            }
        )
    }
    getUsername(station) {
	
	let insertLoc = document.getElementById(station.id);
	let html2 = "";
	fetch('/api/getUsername/' + station.userID)
	.then(result => result.text())
	.then(
	    (result) => {
	    html2 += '~Reserved by ' + result;
	    insertLoc.append(html2);
	    }
	);
    }

    reserve(compID) {
	fetch('/api/reserve/' + compID,{
	     method: 'PUT'
	});
	console.log("reserve");
    }

    release(compID) {
        fetch('/api/release/' + compID,{
             method: 'PUT'
        });
        console.log("release");
    }

    insertRelease(station) {

        let insertLoc = $('#'+station.id);
        let html3 = `
            <button
                class="release"
                stationid=` + station.id + `>
            release
            </button>`

        insertLoc.append(html3);

        $('.release[stationid=' +  station.id + ']').click(function(event) {
            event.preventDefault();
            release(station.id);
        });

    }

    reserveButton(station) {
        if (station.isReserved == true) {
	    let insertLoc = document.getElementById(station.id);

	    let html = "";
            fetch('/api/isReserver/' + station.userID,{
		method: 'GET',
		dataType: 'text/html'
	    })
	    .then(result => result.text())
	    .then(

		(result) => {
		    if (result == "true") {
		        console.log("reserved");
			this.insertRelease(station);
		}
		else {
		    console.log("what");
		    this.getUsername(station);
		}
	    });
        }
        else {
        return (
            <button
                className="reserve"
                onClick={(evt) => {
                evt.preventDefault();
                this.reserve(station.id);
            }}>
            reserve
            </button>
       );
       }
    }

    logOut() {
        this.props.backToLogin();
    }

    render() {
        if (this.state.error) {
            return (
                <div>Error: Can not load computers</div>
            );
        }
        else if (!this.state.isLoaded) {
            return (
                <div>Loading data</div>
            );
        }
        else {
	    let reservationStatus = "";
            return (
                <div className="computers">
		    <button
                    id="logout"
                	onClick={(evt) => {
                	    evt.preventDefault();
                	    this.logOut();
            		}}>
            		Log Out
            	    </button>
                    <h1>List of computers</h1>
                    <ul>
                        {this.state.computers.map(station => {
			    if (station.isReserved == true) {
			    	reservationStatus = "Reserved"
			    }
			    else {                      
				reservationStatus = "Open";
			    }

                            return (
                             <div id={station.id}>
                                <h1>computer {station.id} </h1> 
				<p>Reservation Status: {reservationStatus}</p>
				{this.reserveButton(station)}
                             </div>
                            );
                        })};
                    </ul>
                </div>
            );
        }
    }
}

function reloadComps() {
    window.setTimeout(render, 30000);
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            view: 'login'
        };
    }

    onLogin() {
        this.setState({
            view: 'computers'
        });
    }

    registering() {
    	this.setState({
	    view: 'register'
	});
    }

    backToLogin() {
	this.setState( {
	    view: 'login'
	});
    }

    render() {
        let component = <Login onLogin={() => this.onLogin()} registering={() => this.registering()}/>;
        if (this.state.view == 'computers') {
            component = <Computers backToLogin={() => this.backToLogin()}/>;
        }
	if (this.state.view == 'register') {
	    component = <Register backToLogin={() => this.backToLogin()}/>;
	}

        return (
            <div className="app">
              {component}
            </div>
        );
    }
}

const container = document.querySelector('#app');
const root = ReactDOM.createRoot(container);
root.render(<App />);
