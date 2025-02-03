import Book from "../components/Book"
import Footer from "../components/Footer"
import Header from "../components/Header"
import Hero from "../components/Hero"
import LandingServices from "../components/LandingServices"
import Team from "../components/Team"

const Home = () => {

    return (
        <div className="bg-black w-full">
            <Header />
            <Hero />
            <LandingServices />
            <Team />
            <Book />
            <Footer />
        </div>
    )
}

export default Home