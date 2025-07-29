import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { openOrCreate, SQLiteDatabase } from "@nativescript-community/sqlite";
import { PageRouterOutlet } from '@nativescript/angular';
import { knownFolders, path } from '@nativescript/core';

@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
  imports: [PageRouterOutlet],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppComponent {
  sqlite: SQLiteDatabase;
  names = [
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Bob Brown",
    "Charlie White",
    "Diana Green",
    "Ethan Black",
  ];
  
  openDatabase() {
    console.log("Opening database...");
    const filePath = path.join(
      knownFolders.documents().getFolder('db').path,
      `db.sqlite`
    );
    this.sqlite = openOrCreate(filePath, {
      password: "password",
    });
  }

  createTable() {
    console.log("Creating table in the database...");
    this.sqlite.execute("CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY, name TEXT)");
  }

  addNames() {
    console.log("Inserting names into the database...");
    this.sqlite.transaction(() => {
        return Promise.all(
            this.names.map((name, id) =>
                this.sqlite.execute(
                    "INSERT INTO names (id, name) VALUES (?, ?)",
                    [id, name]
                )
            )
        );
    });
  }

  async getNames() {
    const names = await this.sqlite.selectArray("SELECT * FROM names");
    console.log("Names from database:", names);
    return names;
  }
}
