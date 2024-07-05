import Image from 'next/image';
import pic from "../../../asset/2.png";

const ContentSection = () => {
  return (
    <div className="mb-20">
      <p className="ml-[35%]">
        The <u>Search Essentials</u> outline the most important elements of what makes your website eligible to appear on Google Search. While there&apos;s no guarantee that any particular site will be added to Google&apos;s index, sites that follow the Search Essentials are more likely to show up in Google&apos;s search results. SEO is about taking the next step and working on improving your site&apos;s presence in Search. This guide will walk you through some of the most common and effective improvements you can do on your site.
      </p>
      <p className="font-bold ml-[35%]">As well as:</p>
      <div className="flex items-center ml-10">
        <Image src={pic} alt="SEO Image" width={100} height={100} />
        <ul className="ml-5 list-disc">
          <li>A typical you can influence to help users decide whether they should visit your site through those search results.</li>
          <li>A typical you can influence to help users decide.</li>
          <li>A typical you can influence to help users decide whether they should visit.</li>
          <li>A typical you can influence to help users decide whether they should visit your site through.</li>
        </ul>
      </div>
    </div>
  );
};

export default ContentSection;
