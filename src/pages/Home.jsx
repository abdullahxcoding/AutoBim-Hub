import { useEffect } from 'react'
import Hero from '../components/Hero.jsx'
import Platforms from '../components/Platforms.jsx'
import Products from '../components/Products.jsx'
import Services from '../components/Services.jsx'
import WhyUs from '../components/WhyUs.jsx'
import Process from '../components/Process.jsx'

export default function Home() {
  useEffect(() => {
    document.title = 'AutoBim Hub — BIM Automation, Revit Plugins & Custom AEC Software'
  }, [])
  return (
    <>
      <Hero />
      <Platforms />
      <Products />
      <Services />
      <WhyUs />
      <Process />
    </>
  )
}
