
require('./main.scss');
import React from 'react';
import ReactDOM from 'react-dom';
import styles from './main.module.scss';

if (module['hot']) {
  module['hot'].accept();
}

console.log(process.env.NODE_ENV);

ReactDOM.render(
    <h1 className={styles.example}>Webpaack 5 React typescript template </h1>
,document.getElementById('root'));