import { Component } from '@angular/core';
import { About } from './features/about/about';
import { Contact } from './features/contact/contact';
import { Education } from './features/education/education';
import { Experience } from './features/experience/experience';
import { Hero } from './features/hero/hero';
import { Projects } from './features/projects/projects';
import { Skills } from './features/skills/skills';
import { Navbar } from './shared/navbar/navbar';
import { SiteFooter } from './shared/site-footer/site-footer';

@Component({
  selector: 'app-root',
  imports: [Navbar, Hero, About, Experience, Skills, Projects, Education, Contact, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}