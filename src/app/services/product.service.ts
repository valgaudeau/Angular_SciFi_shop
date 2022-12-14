import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IProduct } from '../product/IProduct.interface';
import { Observable, catchError, tap, throwError, map } from 'rxjs';
import { NgIf } from '@angular/common';

@Injectable({
  providedIn: 'root' // Service is registered in the root, meaning it can be accessed from any component or service in the application. Alternative = component injector.
})
export class ProductService {

private propertyUrl = './assets/products.json';

constructor(private http:HttpClient) { }

// Notes on the functions used below:
// The tap operator allows to access the item emitted by the Observable without modifying it. This operator takes in an arrow function. The parameter 'data' is the emitted data,
// and the arrow function is what we want to do with it. So right now we have (data => console.log('All', JSON.stringify(data))) to log all of the emitted data to the console.
// Next, we have the catchError function. Often the emitted data will have errors, and we want our pipe to catch these issues.
getAllProducts() : Observable<IProduct[]>
{
  return this.http.get<IProduct[]>('http://localhost:5135/api/product').pipe(
      map(data => {
      // Need to have the array of products from local storage and from the JSON file
      const productsFromController: Array<IProduct> = [];
      const productsFromLocalStorage: Array<IProduct> = JSON.parse(localStorage.getItem('productId') || '{}');

      if(productsFromLocalStorage) {
        for(const id in productsFromLocalStorage) {
          if(data.hasOwnProperty(id)) {
            productsFromController.push(productsFromLocalStorage[id]);
          }
        }
      }

      for(const id in data) {
        if(data.hasOwnProperty(id)) {
          productsFromController.push(data[id]);
        }
      }
      return productsFromController;
    })
  );
  // CODE FOR RETRIEVING PRODUCTS FROM JSON FILE
  // return this.http.get<IProduct[]>(this.propertyUrl).pipe(
  //   map(data => {
  //     // Need to have the array of products from local storage and from the JSON file
  //     const productsFromJsonFile: Array<IProduct> = [];
  //     const productsFromLocalStorage: Array<IProduct> = JSON.parse(localStorage.getItem('productId') || '{}');

  //     if(productsFromLocalStorage) {
  //       for(const id in productsFromLocalStorage) {
  //         if(data.hasOwnProperty(id)) {
  //           productsFromJsonFile.push(productsFromLocalStorage[id]);
  //         }
  //       }
  //     }

  //     for(const id in data) {
  //       if(data.hasOwnProperty(id)) {
  //         productsFromJsonFile.push(data[id]);
  //       }
  //     }
  //     return productsFromJsonFile;
  //   })
  // );
  //   // if need to console log all of the data again, use tap(data => console.log('All', JSON.stringify(data))),
  //   tap(),
  //   catchError(this.handleError)
}

// This function finds a single product by its id. We first check if the product is in the array of products saved in local storage, and if its not there, we then go and find it from the JSON file
getProductById(idToFind: number) {
  // If the product id wasn't found in the array saved in local storage, then we can find it in the JSON file
  // Use rxjs library to filter. Here I have a problem tho: If the product is found in the local storage, I'm returning a single product (I think?). If its in the JSON file, I'm returning an obserable.
  // YES this turned out to be an issue. Instead, going to moldify the getAllproducts() function. The function should now fetch the products from the local storage & JSON file, and we can filter it here.
  return this.getAllProducts().pipe(
    map(productArray => {
      // throw new Error('test error');
      return productArray.find(p => p.id == idToFind);
    })
  );
}

private handleError(err: HttpErrorResponse){
  let errorMessage = '';
  if(err.error instanceof ErrorEvent)
  {
    // If a client-side or network error occurred, we can handle it here
    errorMessage = `An error occurred: ${err.error.message}`;
  }
  else
  {
    // If we reach this section, the backend returned an unsuccessful response code.
    // The response body returned by the server should contain clues as to what went wrong.
    errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
  }
  console.error(errorMessage);
  return throwError(() => errorMessage);
}

// Add new product to array of existing products if that array exists, or initialize it if it doesn't exist yet
addProduct(product: IProduct){
  let productList: Array<IProduct> = [];
  if(localStorage.getItem('productId')) {
    productList = JSON.parse(localStorage.getItem('productId') || '{}');
    // Using the spread operator - See https://howtodoinjava.com/typescript/spread-operator/
    productList = [product, ...productList];
  } else {
    productList = [product]
  }
  localStorage.setItem('productId', JSON.stringify(productList));
}

// This will be called when a new product is mapped to the values inputted in the addProduct form, and we need to set a new id for the product being saved to local storage
// Logic: Retrieve array of products in local storage. If length == 0, then we can return 10 as the default id for the first product being added. This is because we have 9 objects in the JSON file.
// If != 0, return the length of array + 10.
newProductId():number {
  // Simply don't understand whats going on here. Why is the first item added given an id of null? If I just change the function to return 10, it works. Makes no sense.
  // I fixed it downstream in add product by adding a NaN check, but I don't understand what the issue is and why this returns NaN for the first product that gets created.
  let productsFromLocalStorage: Array<IProduct> =[];
  productsFromLocalStorage = JSON.parse(localStorage.getItem('productId') || '{}');
  var numberOfProductsInLocalStorage = productsFromLocalStorage.length;
  if(productsFromLocalStorage) {
    return numberOfProductsInLocalStorage + 10;
  } else {
    return 10;
  }
}

}
