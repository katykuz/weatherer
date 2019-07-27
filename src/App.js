import React from 'react';
import './App.css';
//import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment'
import {Bar} from 'react-chartjs-2'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'



class App extends React.Component {

  state={
    weather:null,
    loading:false,
    text:'',
  }

  getWeather = async (e) => {
    e.preventDefault()
    this.setState({loading: true, weather:null})
    var key = 'bb92c64807b9a71733b6763d1e8f858a'
    var url = `http://api.openweathermap.org/data/2.5/forecast?q=${this.state.text}&units=imperial&APPID=${key}`
    var r = await fetch(url)
    var json = await r.json()

    if(r.status===200){
      this.setState({
        weather: json.list, 
        loading:false, 
        text:'', 
        error:null
      })
    } else {
      this.setState({
        error: json.message, 
        loading:false
      })
    }
  }

  function simulateNetworkRequest() {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  function LoadingButton() {
    const [isLoading, setLoading] = useState(false);
  
    useEffect(() => {
      if (isLoading) {
        simulateNetworkRequest().then(() => {
          setLoading(false);
        });
      }
    }, [isLoading]);
  
    const handleClick = () => setLoading(true);
  
    return (
      <Button
        variant="primary"
        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}
      >
        {isLoading ? 'Loading…' : 'Search'}
      </Button>
    );
  }
  
  render(<LoadingButton />);

  render() {
    var {weather, loading, text, error} = this.state
    var data
    if(weather){
      data = {
        labels: weather.map(w=> moment(w.dt*1000).format('ll hh:mm a')),
        datasets: [{
          label:'Temperature',
          borderWidth: 1,
          data: weather.map(w=> w.main.temp),
          backgroundColor: 'rgba(132,99,255,0.2)',
          borderColor: 'rgba(132,99,255,1)',
          hoverBackgroundColor: 'rgba(132,99,255,0.4)',
          hoverBorderColor: 'rgba(132,99,255,1)',
        }]
      }
    }
  return (
    <div className="App">
    <form className="App-header" onSubmit={this.getWeather}>
<TextField value={text}
autoFocus
variant="outlined"
label="Search for Weather"
  onChange={e=> this.setState({text: e.target.value})}
  style={{width:'100%', marginLeft:8}}
/>
{/*<Button variant="contained" color="primary" className="button" disabled={loading || !text} type="submit">
  Search
  </Button>*/}
</form>
{loading &&<LinearProgress />}
      <main>
{data && <Bar
  data={data}
  width={800}
  height={400}
/>}
{error && <div style={{color:'rgb(150,80,50)'}}>{error}</div>}  
  </main>
</div>
);
}
}


export default App;
