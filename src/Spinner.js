class Spinner {
    static show() {
        document.querySelector('.spinner').style.display = 'block';
    }

    static hide() {
        document.querySelector('.spinner').style.display = 'none';
    }

    static hideNews() {
        document.querySelector('.spinner').classList.add('hideNews');
    }
}

export default Spinner;