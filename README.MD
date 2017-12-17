# ng-modal

Lightweight implementation of modal dialogs for Angular.

Includes a [Bootstrap](https://getbootstrap.com/docs/4.0/components/modal/) theme. Also works with standard Bootstrap styles (e.g. from [CDN](<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">)). See the [Styles](#styles) section below for more information on styling.  

## Installation

To install this library, run:

```bash
$ npm install @independer/ng-modal --save
```

## Usage

Import the `ModalModule`:

```ts
import { ModalModule } from '@independer/ng-modal';
...

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...,

    // Import this module in order to use the "modal" component and ModalService
    ModalModule
  ],
  providers: [
    ...
  ],
  bootstrap: [
    ...
  ],
  entryComponents: [
    // Add here modal components that you want to open using ModalService
  ]
})
export class AppModule { }

```

### Option 1 - Inside a template of another component
Define your modal dialog inside a template of another component. For example, in your `home.component.html` you could have:

```html
<modal #firstModal>
  <modal-header>
    <h4>I am a Simple Dialog</h4>
  </modal-header>
  <modal-content>
    This dialog is defined inside a template of another component.
  </modal-content>
  <modal-footer>
    <button (click)="firstModal.close()">okay!</button>
  </modal-footer>
</modal>
```
Then open the dialog as follows:

```html
<button (click)="firstModal.open()">Simple Dialog</button>
```

### Option 2 - Component + ModalService
Define your modal dialog as a component and open it programmatically using `ModalService`.

**modal.component.html**
```html
<modal>
  <modal-header>
    <h4>I am a Programmatic Dialog</h4>
  </modal-header>
  <modal-content>
    This dialog is opened programmatically from code.
  </modal-content>
  <modal-footer>
    <button (click)="close()">okay!</button>
  </modal-footer>
</modal>

```

**modal.component.ts**
```ts
import { Component } from '@angular/core';
import { ModalRef } from '@independer/ng-modal';

@Component({
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  constructor(private modal: ModalRef) {
  }

  close() {
    this.modal.close();
  }
}

```
**Important**: Make sure you add your component to `entryComponents` inside `@NgModule` declaration:

```ts
@NgModule({
  declarations: [...],
  imports: [
    ...,
    ModalModule
  ],
  providers: [...],
  bootstrap: [...],
  entryComponents: [
    ModalComponent
  ]
})
```
Inject the `ModalService` where you want to open your modal component from. For example:

**home.component.ts**
```ts
import { Component } from '@angular/core';
import { ModalService } from '@independer/ng-modal';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'  
})
export class HomeComponent {
  constructor(private modalService: ModalService) {    
  }

  openModal() {
    this.modalService.open(ModalComponent);
  }
}

```

### Option 3 - Router
Define your modal dialog as a component (like in **Option 2**) and open it by navigating to a route.

**modal-route.component.html**
```html
<modal [routeBehavior]="true">
  <modal-header>
    <h4>I am a Routed Dialog</h4>
  </modal-header>
  <modal-content>
    This dialog is opened by navigating to a route
  </modal-content>
</modal>
```
Note here `[routeBehavior]="true"` - this tells the `modal` component to open itself as soon as the router adds it to the DOM, and
after user closes it, navigate back to the previous URL. 

**modal-route.component.ts**
```ts
import { Component } from '@angular/core';

@Component({
  templateUrl: './modal-route.component.html'  
})
export class ModalRouteComponent {
}

```
Define a route:

**app.routing.module**
```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { ModalRouteComponent } from './modal-route.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { 
    path: '', component: HomeComponent, children: [
      { path: 'modal-component', component: ModalRouteComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
```

Open the modal by navigating to `/modal-component`:

```html
<button [routerLink]="['modal-component']">Routed Dialog</button>
```

## Styles

The library comes with two predefined themes:
 
- `independer` - our own theme that we use at `independer.nl`
- `bootstrap` - https://getbootstrap.com/docs/4.0/components/modal/ (note that you don't need to include this theme if your app already includes Bootstrap styles, see below).

In order to include the styles in your Angular CLI application, add the following to the `styles` section of `.angular-cli.json`:

```json
"styles": [
  ...,
  "../node_modules/@independer/modal/<theme>/styles.css"
],
```
*Replace `<theme>` with either `bootstrap` or `independer`*.

If you would like to customize the styles, you can copy the SASS source code from `node_modules/@independer/modal/<theme>/styles.scss` to your application and change it the way you need.

### Works with standard Bootstrap styles
In case your already use [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/) in your app or you would like to use the "official" Bootstrap styles, you don't need
to include any themes in `.angular-cli.json`. The library uses the same CSS classes and HTML structure as
modals in Bootstrap, so it works with the standard Bootstrap styles.

### Examples

See the above examples in action by running the Angular app in the **playground** folder. 

In order to run the example application you need to first build the library and link it to **node_modules** in the **playground** folder. Please follow the following steps:

```bash
# 1. Install dependencies
yarn install

# 2. Build the library
npm run build

# 3. Go to /dist folder
cd dist

# 4.  Create an NPM link
npm link

# 4. Go to the "playground" folder
cd ../playground

# 5. Install dependencies
yarn install

# 6. Run the example application
yarn start
```

Now you can navigate to `http://localhost:4200` to use the **playground** app.

## Development of the Library

To generate all all the package assets in the `dist` folder run:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

To test the library with the `playground` application link the `dist` folder using `npm link`:

```bash
# In "dist" folder
npm link

# in "playground" folder. This step is also done automatically after "yarn install"
npm link @independer/ng-modal
```

## License

MIT © [Independer.nl](https://werkenbij.independer.nl/)
