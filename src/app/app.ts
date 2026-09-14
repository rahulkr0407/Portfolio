import { Component } from '@angular/core';
import { profile } from './core/data/profile';
import { About } from './features/about/about';
import { Contact } from './features/contact/contact';
import { Education } from './features/education/education';
import { Experience } from './features/experience/experience';
import { Hero } from './features/hero/hero';
import { Projects } from './features/projects/projects';
import { Skills } from './features/skills/skills';
import { Marquee } from './shared/marquee/marquee';
import { Navbar } from './shared/navbar/navbar';
import { ScrollProgress } from './shared/scroll-progress/scroll-progress';
import { SiteFooter } from './shared/site-footer/site-footer';

@Component({
  selector: 'app-root',
  imports: [
    Navbar,
    ScrollProgress,
    Marquee,
    Hero,
    About,
    Experience,
    Skills,
    Projects,
    Education,
    Contact,
    SiteFooter,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly marqueeItems = profile.skills.flatMap((category) => category.items);
}