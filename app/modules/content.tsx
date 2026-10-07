import { Children, isValidElement, type ReactNode } from "react";

export type ContentLink = {
  type: "post" | "project";
  title: ReactNode;
  href: string;
  date: string;
};

export const links: ContentLink[] = (
  [
    {
      type: "project",
      title: (
        <>
          <strong>Jib</strong>: CLI tool for deploying apps with Docker
        </>
      ),
      href: "https://github.com/h3yniko/jib/",
      date: "2026-03-22",
    },
    {
      type: "project",
      title: (
        <>
          {" "}
          <strong>Trusty Tail</strong>: Telegram check-in bot for pet owners and backup contacts
        </>
      ),
      href: "https://github.com/h3yniko/trusty-tail",
      date: "2023-12-25",
    },
    {
      type: "post",
      title: "Became a steward for SEAL's Incident Response Framework",
      href: "https://www.linkedin.com/feed/update/urn:li:activity:7462223381883670528/",
      date: "2026-05-18",
    },
    {
      type: "post",
      title: "Won the Black Forest Labs hackathon with HouseView",
      href: "https://www.linkedin.com/feed/update/urn:li:activity:7424729703019831296/",
      date: "2026-02-04",
    },
    {
      type: "project",
      title: (
        <>
          {" "}
          <strong>Foundry VTT Tools</strong>: create rich journal content
        </>
      ),
      href: "https://foundry-vtt-tools.niko.page",
      date: "2026-01-04",
    },
    {
      type: "project",
      title: (
        <>
          {" "}
          <strong>SimpleSign</strong>: sign messages with your Ethereum wallet
        </>
      ),
      href: "https://simple-sign.niko.page",
      date: "2025-12-08",
    },
    {
      type: "project",
      title: (
        <>
          {" "}
          <strong>Dither Mask</strong>: interactive halftone and dithering mask generator
        </>
      ),
      href: "https://dither-mask.niko.page",
      date: "2025-11-08",
    },
    {
      type: "post",
      title: "It's funny how few technical recruiters look at Steam...",
      href: "https://www.linkedin.com/feed/update/urn:li:activity:7385019241600684032/",
      date: "2025-10-17",
    },
    {
      type: "post",
      title: "Just start it, it won't get easier...",
      href: "https://www.linkedin.com/feed/update/urn:li:activity:7382121855865876480/",
      date: "2025-10-09",
    },
    {
      type: "post",
      title: "A 3-step reflection habit that will massively improve your decisions...",
      href: "https://www.linkedin.com/feed/update/urn:li:activity:7380713530687213568/",
      date: "2025-10-05",
    },
    {
      type: "post",
      title: "Personal comparison of LLM coding assistants...",
      href: "https://www.linkedin.com/feed/update/urn:li:activity:7379106654899908608/",
      date: "2025-10-01",
    },
    {
      type: "post",
      title: "Как снизить время в телефоне с ~4-6 часов до ~1 часа в день",
      href: "https://x.com/kozlovzxc/status/1914637536737042433",
      date: "2025-04-22",
    },
    {
      type: "post",
      title: "Блокираторы для дверей для спокойного сна в эирбнб",
      href: "https://x.com/kozlovzxc/status/1792294587706257882",
      date: "2024-05-19",
    },
    {
      type: "post",
      title: "Наконец получил Global Talent визу в Англию 🎉",
      href: "https://x.com/kozlovzxc/status/1770532117509779823",
      date: "2024-03-20",
    },
    {
      type: "post",
      title: "Ultimate productivity system 🏆",
      href: "https://dev.to/hexnickk/ultimate-productivity-system-2foo",
      date: "2024-02-10",
    },
    {
      type: "post",
      title: "Живу без уведомлений уже 4 года",
      href: "https://x.com/kozlovzxc/status/1665334673214521344",
      date: "2023-06-04",
    },
    {
      type: "post",
      title: "Life lessons that Elden Ring can teach us",
      href: "https://dev.to/hexnickk/life-lessons-that-elden-ring-can-teach-us-4890",
      date: "2023-03-20",
    },
    {
      type: "post",
      title: "Как работает HTTPS и центры сертификации с примерами и картинками",
      href: "https://x.com/kozlovzxc/status/1570702425660723207",
      date: "2022-09-16",
    },
    {
      type: "post",
      title: "Как вкатиться в безопасность веба - гайд для разработчиков",
      href: "https://x.com/kozlovzxc/status/1519923445789777920",
      date: "2022-04-29",
    },
    {
      type: "post",
      title: "Разбираемся как улучшить CV 📇",
      href: "https://x.com/kozlovzxc/status/1503016499849613312",
      date: "2022-03-13",
    },
    {
      type: "post",
      title: "Тред с ресурсами для поиска удаленной работы для разработчиков",
      href: "https://x.com/kozlovzxc/status/1501932904246513679",
      date: "2022-03-10",
    },
    {
      type: "post",
      title: "Injecting backdoors to NPM packages",
      href: "https://dev.to/hexnickk/injecting-backdoors-to-npm-packages-a0k",
      date: "2022-02-16",
    },
    {
      type: "post",
      title: "Deep dive into React keys bugs",
      href: "https://dev.to/hexnickk/deep-dive-into-react-keys-bugs-1351",
      date: "2022-02-14",
    },
    {
      type: "post",
      title: "Django Templates with React",
      href: "https://dev.to/hexnickk/django-templates-with-react-4hko",
      date: "2022-02-11",
    },
    {
      type: "post",
      title: "JS interview in 2 minutes / var ⚔️ let ⚔️ const",
      href: "https://dev.to/hexnickk/js-interview-in-2-minutes-var-let-const-39p1",
      date: "2021-06-08",
    },
    {
      type: "post",
      title: "JS interview in 2 minutes / Memoization 💭",
      href: "https://dev.to/hexnickk/js-interview-in-2-minutes-memoization-p37",
      date: "2021-05-26",
    },
    {
      type: "post",
      title: "Hidden power of || and &&",
      href: "https://dev.to/hexnickk/hidden-power-of-and-jng",
      date: "2021-05-24",
    },
    {
      type: "post",
      title: "JS interview in 2 minutes / pure vs impure functions",
      href: "https://dev.to/hexnickk/js-interview-in-2-minutes-pure-vs-impure-functions-22om",
      date: "2021-05-21",
    },
    {
      type: "post",
      title: "JS interview in 2 minutes / Closure",
      href: "https://dev.to/hexnickk/js-interview-in-2-minutes-closure-3hi6",
      date: "2021-05-17",
    },
    {
      type: "post",
      title: "JS interview in 2 minutes / Currying 🥘",
      href: "https://dev.to/hexnickk/js-interview-in-2-minutes-currying-2hko",
      date: "2021-05-14",
    },
    {
      type: "post",
      title: "JS interview in 2 minutes / Promise",
      href: "https://dev.to/hexnickk/js-interview-in-2-minutes-promise-4fhl",
      date: "2021-05-12",
    },
    {
      type: "post",
      title: "JS interview in 2 minutes / this 🤯",
      href: "https://dev.to/hexnickk/js-interview-in-2-minutes-this-3hlm",
      date: "2021-05-07",
    },
    {
      type: "post",
      title: "JS interview in 2 minutes / Encapsulation (OOP)",
      href: "https://dev.to/hexnickk/js-interview-in-2-minutes-encapsulation-oop-2ico",
      date: "2021-05-03",
    },
    {
      type: "post",
      title: "JS interview in 2 minutes / Polymorphism (OOP)",
      href: "https://dev.to/hexnickk/js-interview-in-2-minutes-polymorphism-oop-3pla",
      date: "2021-04-30",
    },
    {
      type: "post",
      title: "JS interview in 2 minutes / Inheritance in OOP",
      href: "https://dev.to/hexnickk/js-interview-in-2-minutes-inheritance-in-oop-53h2",
      date: "2021-04-29",
    },
    {
      type: "post",
      title: "JS interview in 2 minutes / Object-Oriented Programming (OOP)",
      href: "https://dev.to/hexnickk/js-interview-in-2-minutes-object-oriented-programming-oop-3443",
      date: "2021-04-28",
    },
    {
      type: "post",
      title: "JS interview in 2 minutes / Static vs Dynamic typing",
      href: "https://dev.to/hexnickk/js-interview-in-2-minutes-static-vs-dynamic-typing-2d5k",
      date: "2021-04-27",
    },
    {
      type: "post",
      title: "JS interview in 2 minutes / Higher Order Functions",
      href: "https://dev.to/hexnickk/js-interview-in-2-minutes-higher-order-functions-38kb",
      date: "2021-04-26",
    },
    {
      type: "post",
      title: "JS interview in 2 minutes / value vs reference",
      href: "https://dev.to/hexnickk/js-interview-in-2-minutes-value-vs-reference-5a8k",
      date: "2021-04-25",
    },
    {
      type: "post",
      title: "JS interview in 2 minutes / == vs ===",
      href: "https://dev.to/hexnickk/js-interview-in-2-minutes-vs-1f58",
      date: "2021-04-24",
    },
    {
      type: "post",
      title: "How to use WebStorm on the server",
      href: "https://dev.to/hexnickk/how-to-use-webstorm-on-the-server-5e1n",
      date: "2021-04-23",
    },
    {
      type: "post",
      title: "Isolated javascript development environment / 2021",
      href: "https://dev.to/hexnickk/isolated-javascript-development-environment-2021-326m",
      date: "2021-04-06",
    },
  ] satisfies ContentLink[]
).sort((first, second) => second.date.localeCompare(first.date));

export function titleText(title: ReactNode): string {
  return Children.toArray(title)
    .map((child) => {
      if (isValidElement<{ children?: ReactNode }>(child)) {
        return titleText(child.props.children);
      }
      return typeof child === "string" || typeof child === "number" || typeof child === "bigint"
        ? String(child)
        : "";
    })
    .join("");
}
