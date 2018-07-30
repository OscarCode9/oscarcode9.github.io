import 'babel-polyfill';

class App {
    constructor() {
        console.info('App Initialized');
    }

    getEmail() {

        const loadEmail = async () => {
            const result = await fetch('/api/getAllEmail');
            const emails = await result.json();
            console.log(emails);
        }

        loadEmail();




    }
}


export default App;