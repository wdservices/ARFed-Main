import Head from "next/head";
import { useState, useEffect } from "react";
import FooterNav from "../components/footerNav";
import HeaderNav from "../components/headerNav";
import SwiperComp from "../components/Swiper";
import { getCookie } from "cookies-next";
import styles from "../styles/Home.module.css";
import Link from "next/link.js";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

export default function Home() {
  const [pos, setPosition] = useState(0);
  const token = getCookie("token");
  const router = useRouter();

  const models = [
    "https://cdn.glitch.global/529f750b-7ad0-41f0-95f4-66cd14b039de/BuzzBee.glb?v=1682454595829",
    "https://cdn.glitch.global/529f750b-7ad0-41f0-95f4-66cd14b039de/Horse.glb?v=1682081126722",
    "https://cdn.glitch.me/529f750b-7ad0-41f0-95f4-66cd14b039de/Fishes.glb?v=1682460808608"
  ];
  useEffect(() => {
    if (token !== undefined && window.innerWidth < 820) {
      router.push("/subjects");
    }
    setTimeout(() => {
      pos === 2 ? setPosition(0) : setPosition(pos + 1);
    }, "20000");
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>ARFed</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta
          name="description"
          content="ARFED is a web-based augmented reality application, created to help both students and teachers visualize topics/subject taught in the classroom in 3D."
        />
      </Head>
      <main className={styles.main}>
        <HeaderNav />
        <div className="lg:mx-32 relative py-40 h-screen">
          <div className="w-full absolute top-32 z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {
                  scale: 0.8,
                  opacity: 0,
                },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: {
                    delay: 0.4,
                  },
                },
              }}
            >
              <div>
                <div className="text-[#39F9CD] font-bold lg:text-3xl text-xl leading-tight">
                  ARFED
                </div>
                <div className="font-bold lg:text-6xl lg:w-1/2 text-4xl leading-tight">
                  Revitalizing Education Using Augmented Reality.
                </div>
                <div className="font-bold text-4xl leading-tight"> </div>
              </div>
            </motion.div>
            <div className="text-[#767676] lg:my-6 my-2 lg:w-1/2">
              Revolutionize your learning with ARFED! Our web-based augmented
              reality app transforms classroom topics into mesmerizing 3D
              visuals, making education more immersive and engaging. Whether
              you're a student or a teacher, ARFED is the ultimate tool for a
              one-of-a-kind learning experience.
            </div>
            <div>
              <Link href="/login">
                <button className="p-4 rounded-full w-52 text-sm text-white bg-[#5925DC]">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
          <div className="w-full z-1 h-96 absolute top-0">
            <model-viewer
              src={models[pos]}
              auto-rotate
              ar
              ar-modes="webxr scene-viewer quick-look"
              shadow-intensity="1"
              autoplay
            ></model-viewer>
          </div>
        </div>
        <div
          id="about"
          className="bg-[#39F9CD] lg:mx-32 lg:p-8 p-4 lg:flex justify-between rounded-md"
        >
          <div className="lg:lg:w-80 w-full">
            <video autoPlay loop muted playsInline poster="/images/video-img.png" src="/images/tutorial.mp4">
              <source src="/images/tutorial.mp4" type="video/mp4" />
            </video>
            {/* <img src="/images/video-img.png" alt="" /> */}
          </div>
          <div className="lg:w-[65%] my-auto">
            {/* <div className='text-[#3E1D6C]'>Long Label text as headline</div> */}
            <div className="lg:text-5xl text-2xl my-2 text-[#3E1D6C] leading-tight font-bold">
              What Is ARFed.
            </div>
            <div className="text-base lg:my-6 my-2 text-black leading-tight">
              ARFed is an innovative web-based augmented reality application
              that brings classroom topics to life in stunning 3D visuals. It is
              designed to help both students and teachers visualize and interact
              with topics/subjects taught in the classroom in a more engaging
              and immersive way. ARFed allows teachers to connect with their
              students in extraordinary, interactive experiences anywhere they
              are, all with no app required.
            </div>
            <a href="https://docs.google.com/document/d/16T52_bW-fZlmAnnRtWQ0cqzV7122Vp2PHciLbYwCwhE/edit?usp=sharing" target="_blank">
              <div className="my-6 text-[#1A1A1A] cursor-pointer text-[#3E1D6C] underline">View Document</div>
            </a>
          </div>
        </div>
        <div className="lg:flex my-10 lg:mx-32 justify-between">
          <motion.div
            className="lg:my-3 my-8 relative"
            whileHover={{
              position: "relative",
              zIndex: 1,
              scale: 1.2,
              transition: {
                duration: 0.2,
              },
            }}
          >
            <div className="bg-[#39F9CD] lg:w-80 w-[95%] h-52"></div>
            <div className="bg-white lg:w-80 w-[95%] h-52 absolute top-4 left-4 p-6">
              <div className="text-base text-black text-center my-5">
                Massive Reach
              </div>
              <div className="text-sm text-black text-center">
                ARFed experiences can be accessed by 5 billion iOS and Android
                smartphones worldwide in addition to AR headsets.
              </div>
            </div>
          </motion.div>
          <motion.div
            className="lg:my-3 my-8 relative"
            whileHover={{
              position: "relative",
              zIndex: 1,
              scale: 1.2,
              transition: {
                duration: 0.2,
              },
            }}
          >
            <div className="bg-[#5925DC] lg:w-80 w-[95%] h-52"></div>
            <div className="bg-white lg:w-80 w-[95%] h-52 absolute top-4 left-4 p-6">
              <div className="text-base text-black text-center my-5">
                {" "}
                Creative Freedom{" "}
              </div>
              <div className="text-sm text-black text-center">
                Harness the freedom and flexibility of the web with complete
                control of your content, launch schedule, analytics solution and
                more.
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:my-3 my-8 relative"
            whileHover={{
              position: "relative",
              zIndex: 1,
              scale: 1.2,
              transition: {
                duration: 0.2,
              },
            }}
          >
            <div className="bg-[#39F9CD] lg:w-80 w-[95%] h-52"></div>
            <div className="bg-white lg:w-80 w-[95%] h-52 absolute top-4 left-4 p-6">
              <div className="text-base text-black text-center my-5">
                {" "}
                No App Required{" "}
              </div>
              <div className="text-sm text-black text-center">
                ARFed experiences require no app to download, reducing
                activation energy and barrier to entry to increase engagement
                with your content
              </div>
            </div>
          </motion.div>
        </div>
        <div id="features" className="my-32 lg:mx-32">
          <div className="lg:w-1/2 text-center mx-auto">
            <div className="lg:text-3xl text-xl font-bold text-[#39F9CD] my-2">
              Features
            </div>
            <div className="lg:text-sm text-xs">
              Some of the subjects covered in this app.
            </div>
          </div>
          <SwiperComp />
          <Link href={"/features"}>
            <div className="text-center cursor-pointer">See More</div>
          </Link>
        </div>

        <div className="lg:m-32">
          <div className="lg:w-1/2 text-center mx-auto">
            <div className="lg:text-3xl text-xl font-bold text-[#39F9CD] my-2">
              Improve Learning Outcomes by Integrating AR into your Lessons
            </div>
            <div className="lg:text-sm text-xs">
              According to research, augmented reality has the potential to
              revolutionize teaching and facilitate students in achieving their
              learning objectives. With ARFed, you can captivate your students
              and enhance your current lessons in a fantastic way. Get ready to
              take your teaching to new heights with ARFed!
            </div>
          </div>
          <div className="lg:flex my-10 justify-between">
            <motion.div
              className="lg:my-3 my-8 relative"
              whileHover={{
                position: "relative",
                zIndex: 1,
                scale: 1.2,
                transition: {
                  duration: 0.2,
                },
              }}
            >
              <div className="bg-[#5925DC] rounded-md lg:w-80 w-[95%] h-60"></div>
              <div className="bg-white lg:w-80 w-[95%] h-60 rounded-md absolute top-4 left-4 p-6">
                <div className="text-base text-black text-center my-5">
                  EXPOSURE{" "}
                </div>
                <div className="text-sm text-black text-center">
                  Learning through exposure can boost students' understanding by
                  up to 75%. ARFed increases your student's ability to retain
                  knowledge by immersing them in exciting experiences they will
                  never forget.
                </div>
              </div>
            </motion.div>
            <motion.div
              className="lg:my-3 my-8 relative"
              whileHover={{
                position: "relative",
                zIndex: 1,
                scale: 1.2,
                transition: {
                  duration: 0.2,
                },
              }}
            >
              <div className="bg-[#39F9CD] rounded-md lg:w-80 w-[95%] h-60"></div>
              <div className="bg-white lg:w-80 w-[95%] rounded-md h-60 absolute top-4 left-4 p-6">
                <div className="text-base text-black text-center my-5">
                  ENGAGE
                </div>
                <div className="text-sm text-black text-center">
                  Research has it that We only remember 10% of what we read but
                  can retain 90% of what we experience. Improve students'
                  interaction within the classroom by incorporating visual
                  stimuli with ARFed virtual experiences.
                </div>
              </div>
            </motion.div>
            <motion.div
              className="lg:my-3 my-8 relative"
              whileHover={{
                position: "relative",
                zIndex: 1,
                scale: 1.2,
                transition: {
                  duration: 0.2,
                },
              }}
            >
              <div className="bg-[#5925DC] rounded-md lg:w-80 w-[95%] h-60"></div>
              <div className="bg-white lg:w-80 w-[95%] h-60 rounded-md absolute top-4 left-4 p-6">
                <div className="text-base text-black text-center my-5">
                  {" "}
                  ACHIEVE{" "}
                </div>
                <div className="text-sm text-black text-center">
                  Learning through exposure can boost students' understanding by
                  up to 75%. ARFed increases your student's ability to retain
                  knowledge by immersing them in exciting experiences they will
                  never forget.
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div id="pricing" className="my-32 lg:mx-32">
          <div className="lg:w-1/2 text-center mx-auto">
            <div className="lg:text-3xl text-xl font-bold text-[#39F9CD] my-2">
              Pricing Offers
            </div>
            <div className="lg:text-sm text-xs">
              When it comes down to it, size doesn't matter - it's about price.
              That's why you can find a plan that fits your budget and boost
              engagement with your students or kids with WebAR from day one.
            </div>
          </div>
          <div className="lg:flex justify-between my-10">
            <Link href={`/login`}>
              <div className="lg:w-[30%] border border-[#39F9CD] p-6 text-center rounded-md my-4">
                <div className="text-2xl text-[#39F9CD]">Free</div>
                <div className="text-sm w-[80%] my-4 mx-auto">
                  limited amount of ARFed access is available.
                </div>
                <div className="text-3xl text-[#39F9CD]">$0</div>
              </div>
            </Link>
            <Link href={`/login`}>
              <div className="lg:w-[30%] border border-[#5925DC] p-6 text-center rounded-md my-4">
                <div className="text-2xl text-[#39F9CD]">Single User</div>
                <div className="text-sm w-[80%] my-4 mx-auto">
                  Individuals are eligible to enroll in this plan
                </div>
                <div className="flex w-28 mx-auto justify-between">
                  <div className="text-3xl text-[#39F9CD]">$1.99</div>
                  <div className="my-auto text-[#39F9CD]">/monthly</div>
                </div>
                <div className="text-left text-sm my-1">
                  <span className="text-xl text-[#39F9CD]">+</span> An unlimited
                  amount of ARFed access is available.
                  <br />
                  <span className="text-xl text-[#39F9CD]">+</span> You can
                  upload your own 3D model
                </div>
              </div>
            </Link>
            <Link href={`/login`}>
              <div className="lg:w-[30%] border border-[#39F9CD] p-6 text-center rounded-md my-4">
                <div className="text-2xl text-[#39F9CD]">Group Users</div>
                <div className="text-sm w-[80%] my-4 mx-auto">
                  Nowadays, it isn't uncommon to see lenders rapidly adopting a
                  digital
                </div>
                <div className="flex w-40 mx-auto justify-between">
                  <div className="text-3xl text-[#39F9CD]">$6.99</div>
                  <div className="my-auto text-[#39F9CD]">/monthly</div>
                </div>
                <div className="text-left text-sm my-1">
                  <span className="text-xl text-[#39F9CD]">+</span> An unlimited
                  amount of ARFed access is available.
                  <br />
                  <span className="text-xl text-[#39F9CD]">+</span> You can
                  upload your own 3D model
                  <br />
                  <span className="text-xl text-[#39F9CD]">+</span> Unlimited
                  users
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="lg:mx-32 lg:p-20 p-8 my-20 text-center bg-[#5925DC] rounded-md">
          <div className="text-4xl font-bold text-[#39F9CD]">
            Subscribe on our Newsletter
          </div>
          <div className="my-6 text-sm lg:w-[70%] mx-auto">
            Stay up-to-date with all the latest news and updates on ARFed!
            Subscribe to our newsletter today and never miss out on exciting
            developments and new features. Join the ARFed community now and
            discover a whole new world of immersive learning!
          </div>
          <div className="lg:flex lg:w-1/2 mx-auto">
            <input
              type="text"
              placeholder="Enter your email"
              className="p-3 bg-transparent border border-white w-[95%]"
            />
            <button className="p-3 bg-[#39F9CD] text-black font-bold w-[95%] hover:bg-transparent hover:border hover:border-white">
              Subscribe
            </button>
          </div>
          <div className="text-sm text-center my-3">
            We will never spam you. Only useful mails with promo and events
          </div>
        </div>
        <FooterNav />
      </main>
    </div>
  );
}
