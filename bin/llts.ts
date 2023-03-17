#!/usr/bin/env node

import {init} from '../src/init';

switch (process.argv[2]) {
  case 'init':
    init();
}
