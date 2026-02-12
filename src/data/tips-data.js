export const tipsData = [
    {
        id: 1,
        title: "Clean Topology",
        category: "Modeling",
        level: "Advanced",
        author: "PzTree",
        videoUrl: "https://www.youtube.com/embed/MD1QmdqXRfc",
        content: "Always maintain quad-based topology for characters that need to be animated. Triangles are acceptable on hard-surface objects that won't deform, but quads ensure smooth skinning and subdivision."
    },
    {
        id: 2,
        title: "PBR Material Workflow",
        category: "Texturing",
        level: "Beginner",
        author: "Manson Akram",
        videoUrl: "https://www.youtube.com/embed/6lioyniEl_E",
        content: "When creating PBR materials, remember that metals have a black albedo and rely on the metallic and roughness maps for color. Non-metals (dielectrics) have an albedo color and 0 metallic value."
    },
    {
        id: 3,
        title: "Lighting Composition",
        category: "Rendering",
        level: "Intermediate",
        author: "Kaizen",
        videoUrl: "https://www.youtube.com/embed/ElMM3u2MO5k",
        content: "Use the 3-point lighting setup as a baseline: Key light (main source), Fill light (softens shadows), and Rim light (separates object from background). Adjust intensity and color temperature to set the mood."
    },
    {
        id: 4,
        title: "UV Unwrapping",
        category: "Modeling",
        level: "Intermediate",
        author: "OnMars",
        videoUrl: "https://www.youtube.com/embed/XleO7DBm1Us",
        content: "Place UV seams in hidden areas (under arms, inner legs, back of head). Maintain consistent texel density across your model to avoid blurry textures next to sharp ones."
    },
    {
        id: 5,
        title: "Baking Normals",
        category: "Texturing",
        level: "Advanced",
        author: "Markom3D",
        videoUrl: "https://www.youtube.com/embed/SDqpnfTRtIU",
        content: "When baking high-poly to low-poly, ensure your low-poly object's smoothing groups are set correctly (usually one smoothing group for the UV shell) to avoid artifacts in the normal map."
    },
    {
        id: 6,
        title: "Color Theory in 3D",
        category: "Art Direction",
        level: "Beginner",
        author: "Kaizen",
        videoUrl: "https://www.youtube.com/embed/9saXXFC83l4",
        content: "Understanding complementary, split-complementary, and analogous color schemes can drastically improve your renders. Use saturation to guide the viewer's eye to focal points."
    },
    {
        id: 7,
        title: "Rigging Basics",
        category: "Animation",
        level: "Advanced",
        author: "Joey Carlino",
        videoUrl: "https://www.youtube.com/embed/m-Obo_nC3SM",
        content: "Proper joint placement is crucial. Place joints at the pivot points of real anatomy (e.g., the elbow joint should be where the bone rotates, not in the middle of the flesh)."
    }
];
