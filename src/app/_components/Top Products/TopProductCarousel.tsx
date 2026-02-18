"use client";
import EmblaCarousel from "../../../components/shared/EmblaCarousel";

const items = [
  {
    id: 1,
    title: "ইসলামী ঐতিহ্যের অভিজাত স্পর্শ",
    desc: "আধুনিক ও নান্দনিক ইসলামী ওয়াল বোর্ড, যা ঘরের সৌন্দর্য বৃদ্ধি করে এবং ইসলামের শান্তিপূর্ণ বার্তা স্মরণ করিয়ে দেয়।",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "নান্দনিক ইসলামী ওয়াল বোর্ড",
    desc: "দৃষ্টিনন্দন ইসলামী ওয়াল বোর্ড, যা আপনার ঘরের আভিজাত্য বৃদ্ধি করে এবং ইসলামের মূল্যবোধকে তুলে ধরে।",
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "পবিত্রতার ছোঁয়া ঘরে",
    desc: "ইসলামী ওয়াল বোর্ড, যা ঘরের পরিবেশে আনে পবিত্রতার ছোঁয়া এবং আপনাকে ইসলামের শিক্ষার সাথে যুক্ত রাখে।",
    image:
      "https://images.unsplash.com/photo-1558882224-dda166733046?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    title: "ইসলামী ঐতিহ্যের অভিজাত স্পর্শ",
    desc: "আকর্ষণীয় ডিজাইনের ইসলামী ওয়াল বোর্ড, যা ইসলামী ঐতিহ্যের সৌন্দর্যকে ফুটিয়ে তোলে আপনার ঘরের দেয়ালে।",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const TopProductCarousel = () => {
  return (
    <EmblaCarousel dotButtons autoplay>
      {items.map((item) => (
        <div
          key={item.id}
          className="[flex:0_0_100%] w-full h-full bg-cover bg-no-repeat bg-center md:aspect-[20/11] aspect-[16/6]"
          style={{
            backgroundImage: `url(${item.image})`,
          }}
        >
          <div className=" bg-black/30 text-white sm:p-10 p-6 h-full w-full">
            <h1 className=" lg:text-4xl min-[980px]:text-3xl md:text-2xl min-[550px]:text-3xl text-2xl font-bold">
              {item.title}
            </h1>
            <p className="mt-3 min-[980px]:text-base md:text-sm min-[550px]:text-base min-[500px]:text-sm text-xs">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </EmblaCarousel>
  );
};

export default TopProductCarousel;
