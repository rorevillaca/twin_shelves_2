const recommender_data = [
    {
      "id": 6,
      "name": "PhD Candidate T. Tsui",
      "name_lastname": "Tanya Tsui",
      "faculty": "Architecture and the Built Environment",
      "color": "41bb62",
      "sentence": "Not only did these 10 books teach me about circularity in the built environment, they also changed how I viewed the world: from seeing it as a collection of objects to an interconnected system… I hope they do the same for you!"
    },
    {
      "id": 2,
      "name": "MSc F. Bucci Ancapi",
      "name_lastname": "Felipe Bucci Ancapi",
      "faculty": "Architecture and the Built Environment",
      "color": "41bb62",
      "sentence": "The circular economy can be a means to radically change the way humanity thrives on Earth."
    },
    {
      "id": 13,
      "name": "Dr. A. Wandl",
      "name_lastname": "Alexander Wandl",
      "faculty": "Architecture and the Built Environment",
      "color": "41bb62",
      "sentence": "This collection of books brings together an overview of how the concept of the Circular Economy can be applied towards sustainable spatial development. These books are selected through the lens of an urbanist, therefore not focusing on product design, like the majority of literature in the CE field. Instead, they explore how the concept of Circular Economy can be applied to how we live together, making a step from circular economy towards a circular and regenerative society."
    },
    {
      "id": 7,
      "name": "Dr. D. Stead",
      "name_lastname": "Dominic Stead",
      "faculty": "Architecture and the Built Environment",
      "color": "41bb62",
      "sentence": "This set of books brings together classic texts and contemporary sources from key authors in the field and offers an ideal starting point for readers wishing to familiarize themselves with some of the most important issues concerning sustainable mobility in today’s cities."
    },
    {
      "id": 24,
      "name": "Prof. dr. ing. S. Nijhuis",
      "name_lastname": "Steffen Nijhuis",
      "faculty": "Architecture and the Built Environment",
      "color": "41bb62",
      "sentence": "This selection of books displays a wide range of themes relevant to sustainable urban development: from the past to the future, research and design, as well as perspectives and solutions that integrate nature, culture and technology. These books are of great inspiration to me for my design-oriented research, education and applications that foster the mutually beneﬁcial relationship between urban regions and the ecosystems it depends on."
    },
    {
      "id": 18,
      "name": "Dr.ir. B. Wouters",
      "name_lastname": "Bert Wouters",
      "faculty": "Civil Engineering and Geosciences",
      "color": "4666b9",
      "sentence": "A collection of books to inspire those aspiring to tackle the mammoth challenge of climate change, an endeavor which requires reaching beyond disciplinary boundaries as a scientist, but can only be successful when accompanied by systemic changes in societies, politics, and economies."
    },
    {
      "id": 8,
      "name": "PhD Candidate Z. Liu",
      "name_lastname": "Zhaowen Liu",
      "faculty": "Civil Engineering and Geosciences",
      "color": "4666b9",
      "sentence": "These books cover various aspects of the circular economy, from theoretical foundations to practical applications, offering valuable insights for those interested in sustainability and the intersection of environmental economics and sociology."
    },
    {
      "id": 17,
      "name": "Dr.ir. N. van Oort",
      "name_lastname": "Niels van Oort",
      "faculty": "Civil Engineering and Geosciences",
      "color": "4666b9",
      "sentence": "What I love about teaching and researching (public) transport is its multidisciplinary character, such as data, engineering and behaviour. Mobility is much more than just moving from A to B, think for instance about its societal impacts on spatial quality, the environment and inclusivity. Enjoy the ride from in-depth science to tangible applications and experience!"
    },
    {
      "id": 3,
      "name": "Dr. F. Di Maio",
      "name_lastname": "Francesco Di Maio",
      "faculty": "Civil Engineering and Geosciences",
      "color": "4666b9",
      "sentence": "Unleash the power of circularity: You will discover innovative solutions for a sustainable future by exploring these books."
    },
    {
      "id": 5,
      "name": "Prof.dr.ir. B. van Arem",
      "name_lastname": "Bart van Arem",
      "faculty": "Civil Engineering and Geosciences",
      "color": "4666b9",
      "sentence": "Automated Driving Systems have fascinated researchers and writers for decades. This book collection was developed with input from experts across the globe. It covers the research ﬁeld from a technical and application perspective, and presents landmarks in the development. Get ready for inspiration and amazement."
    },
    {
      "id": 21,
      "name": "Dr. A. Zgonnikov",
      "name_lastname": "Arkady Zgonnikov",
      "faculty": "Mechanical, Maritime and Materials Engineering",
      "color": "4dbec6",
      "sentence": "Spanning from the times of Ancient Greece to the end of the XXI century, these books provide a glimpse into the historical roots, technological advances, and sociocultural impacts of the fascinating field of cognitive robotics."
    },
    {
      "id": 19,
      "name": "Dr. J. Ubacht",
      "name_lastname": "Jolien Ubacht",
      "faculty": "Technology, Policy and Management",
      "color": "9e50ae",
      "sentence": "The transition from a linear toward a circular economy requires a systems thinking perspective to tackle its inherent complexities and uncertainties. The selected books introduce the concept of a circular economy and offer a diversity of application domains to inspire researchers to contribute to this systemic transition."
    },
    {
      "id": 27,
      "name": "Prof.dr.mr.ir. N. Doorn",
      "name_lastname": "Neelke Doorn",
      "faculty": "Technology, Policy and Management",
      "color": "9e50ae",
      "sentence": "This selection of books provides perspectives from the social sciences and humanities to climate change, focusing on the social contexts in which we make climate decisions and try to implement different solutions. "
    },
    {
      "id": 28,
      "name": "Ing. A. van der Helm",
      "name_lastname": "Aadjan van der Helm",
      "faculty": "Industrial Design Engineering",
      "color": "db214bff",
      "sentence": "These books have knowledge about how people think as well as how computers think. An essential mix to design the pervasive digital technologies to enrich the daily live of people and planet. I have selected books that reflect my personal motto to engage in this endeavour with humor and hope!"
    },
    {
      "id": 30,
      "name": "Dr.ir. S.F.J. Flipsen",
      "name_lastname": "Bas Flipsen",
      "faculty": "Industrial Design Engineering",
      "color": "db214bff",
      "sentence": "Leave tracks, no traces -These books are essential for future product developers. They will give you insight in how to design rigth based on facts and figures and with a heart for making."
    },
    {
      "id": 1,
      "name": "Dr. N. Yorke-Smith",
      "name_lastname": "Neil Yorke-Smith",
      "faculty": "Electrical Engineering, Mathematics and Computer Science",
      "color": "f25794",
      "sentence": "Artificial Intelligence enjoys its `third summer' from the 2010s.  It is no new field, and AI is much more than only machine learning and deep neural networks.  This collection of books reaches from popular science explanations of AI, through influential critiques of the foundations of AI, to science fiction visions of the AI future."
    },
    {
      "id": 23,
      "name": "Dr. M. Loog",
      "name_lastname": "Marco Loog",
      "faculty": "Electrical Engineering, Mathematics and Computer Science",
      "color": "f25794",
      "sentence": "As everything seems to be AI these days, there may be few books that could not have made it to this florilegium; the hints of artificial intelligence here provided show diversity and depth, humor and horror, while some of the shoulders I try to stand on are acknowledged as well."
    },
    {
      "id": 22,
      "name": "Dr. J. van Gemert",
      "name_lastname": "Jan van Gemert",
      "faculty": "Electrical Engineering, Mathematics and Computer Science",
      "color": "f25794",
      "sentence": "I am researching and teaching Deep Learning. This list of AI books influenced me and reflects AI itself: Mixing fiction, popular science, and techniques."
    },
    {
      "id": 14,
      "name": "Dr.ir. R. Remis",
      "name_lastname": "Rob Remis",
      "faculty": "Electrical Engineering, Mathematics and Computer Science",
      "color": "f25794",
      "sentence": "Humanity witnessed gigantic global economic development with great technological improvements and growing consumption. However, as a result of this growth, waste streams and the primary greenhouse gasses emitted by human activities increased drastically. In this book, Van Straten and Horeman present their findings on creating a sustainable healthcare economy by introducing different circular strategies."
    },
    {
      "id": 26,
      "name": "Dr. J. Guo",
      "name_lastname": "Jian Guo",
      "faculty": "Aerospace Engineering",
      "color": "f57e4b",
      "sentence": "Aiming at igniting imagination and inspiring creativity, this collection of books provides comprehensive coverage on every aspect of space exploration, from memories to dreams, from Earth orbiting to solar system adventure, and from technologies to policies.  "
    },
    {
      "id": 25,
      "name": "PhD Candidate P. Proesmans",
      "name_lastname": "Pieter-Jan Proesmans",
      "faculty": "Aerospace Engineering",
      "color": "f57e4b",
      "sentence": "The path to sustainable aviation will require a truly multidisciplinary approach. These ten books helped me cover various aspects during my PhD research since they provide insights into aircraft design, engine performance and emissions, climate science, and airline operations. "
    },
    {
      "id": 20,
      "name": "Dr.ir. R. Vos",
      "name_lastname": "Roelof Vos",
      "faculty": "Aerospace Engineering",
      "color": "f57e4b",
      "sentence": "To enable sustainable aviation, we need propulsion systems that don’t produce emissions contributing to global warming. However, the energy required to transport people means our aircraft must improve. We need advances in configuration, lighter structures, and better aerodynamics. Finally, we must ensure policies prevent these advances from drastically increasing flights due to lower costs."
    },
    {
      "id": 4,
      "name": "Dr. K. Djanashvili",
      "name_lastname": "Kristina Djanashvili",
      "faculty": "Applied Sciences",
      "color": "f9ad30",
      "sentence": "My suggestion for 10 books on Biomedical Imaging, covers: i) physics behind various imaging techniques, ii) design and synthesis of imaging probes, iii) image reconstruction/data processing, and iv) the role of AI. "
    },
    {
      "id": 29,
      "name": "Dr.ir. Willemijn Elkhuizen",
      "name_lastname": "Willemijn Elkhuizen",
      "faculty": "Industrial Design Engineering",
      "color": "db214bff",
      "sentence": ""
    },
    {
      "id": 31,
      "name": "Studium Generale",
      "name_lastname": "Studium Generale",
      "faculty": "",
      "color": "ea6845  ",
      "sentence": "We bring you events that challenge your perspective. Debate, listen, imagine, and create beyond your discipline. Find us at sg.tudelft.nl"
    },
    {
      "id": 32,
      "name": "Dr. E. Ozcan Vieira",
      "name_lastname": "Elif Ozcan",
      "faculty": "Industrial Design Engineering",
      "color": "db214bff",
      "sentence": ""
    }
]











